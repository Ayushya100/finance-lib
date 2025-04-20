'use strict';

import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as OpenApiValidator from 'express-openapi-validator';
import axios from 'axios';
import os from 'os';
import path from 'path';
import { logger } from '../utils/index.js';
import { userContext, errorHandler } from '../middlewares/index.js';
import { generalServiceConfig } from '../../constants.js';

const log = logger('service-template');

class Service {
  constructor(serviceConfig, cookieEnable = false, openApiEnabled = true) {
    log.debug('Service constructor has been called');
    this.app = express();

    this.payloadSizeLimit = process.env.PAYLOAD_SIZE_LIMIT;
    this.originPath = process.env.ORIGIN_PATH;
    this.urlPayloadLimit = process.env.URL_PAYLOAD_LIMIT;
    this.apiLimit = Number(process.env.API_LIMIT) || 100;
    this.windowSize = Number(process.env.WINDOW_SIZE) || 5 * 60 * 1000;
    this.cookieKey = process.env.COOKIE_KEY;

    this.cookieEnable = cookieEnable;
    this.openApiEnabled = openApiEnabled;
    this.serviceConfig = serviceConfig;

    const mainModulePath = process.argv[1];
    const appRoot = path.dirname(mainModulePath);
    this.openapiSpec = path.join(appRoot, 'openapi.yaml');

    this.initializeApp();
    this.initializeOpenAPI();
    this.registerErrorHandler();
  }
}

Service.prototype.initializeApp = function () {
  log.debug('App middlewares initilialization');
  this.app.use(
    express.json({
      limit: this.payloadSizeLimit || '1mb', // Maximum request body size
    })
  );

  this.app.use(
    express.urlencoded({
      limit: this.urlPayloadLimit || '64kb', // Maximum url-body size
      extended: false,
    })
  );

  this.app.use(
    cors({
      origin: this.originPath,
      credentials: true,
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  this.app.use(
    rateLimit({
      windowMs: this.windowSize, // Window size
      limit: this.apiLimit, // Limit each IP to the provided number of requests per window size
    })
  );

  if (this.cookieEnable) {
    if (!this.cookieKey) {
      log.error('Cookie key not found');
      process.exit(1);
    }
    this.app.use(
      cookieParser({
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        signed: this.cookieKey,
      })
    );
  }

  this.app.use(express.static('public'));
};

Service.prototype.initializeOpenAPI = function () {
  log.debug('App openAPI validator middleware initialization');
  // Initialize OpenAPI
  if (this.openApiEnabled) {
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: this.openapiSpec,
        validateRequests: true,
        validateResponses: true,
      })
    );
  }
};

Service.prototype.getUserContext = function () {
  log.debug('Global user context middleware initialized');
  this.app.use(userContext);
};

Service.prototype.registerServiceEndpoints = function () {
  log.debug('Register service end-points');
};

Service.prototype.registerErrorHandler = function () {
  log.debug('Global error handler middleware initialization');
  this.app.use(errorHandler);
};

Service.prototype.buildConnection = function () {
  log.debug('Service build initiated');
  if (!this.serviceConfig) {
    log.error('No service configuration provided.');
    process.exit(1);
  }

  this.registerServiceEndpoints();

  const serviceName = this.serviceConfig.serviceName;
  const HOST = this.serviceConfig.HOST;
  const PORT = this.serviceConfig.PORT;

  this.app.listen(PORT, HOST, () => {
    log.info(`[${serviceName}] Server is running on port : ${PORT}`);
    log.info(
      `Uptime : ${process.uptime()} seconds | Timestamp : ${Date.now()} | Hostname : ${os.hostname()}`
    );
  });
};

Service.prototype.testConnection = async function () {
  log.debug('Service connection test initiated');
  if (!this.serviceConfig) {
    log.error('No service configuration provided.');
    process.exit(1);
  }

  const serviceName = this.serviceConfig.serviceName;
  const HOST = this.serviceConfig.HOST;
  const PORT = this.serviceConfig.PORT;
  const PROTOCOL = this.serviceConfig.PROTOCOL;
  const timeout = generalServiceConfig.timeout;
  const retries = generalServiceConfig.retries;

  let response = null;
  let error = null;
  let retry = 0;

  while (retry < retries) {
    try {
      const API = `${PROTOCOL}://${HOST}:${PORT}/${serviceName}/api/v1.0/health`;
      response = await axios.get(API, {
        timeout: timeout,
      });
      break;
    } catch (err) {
      if (retry < retries) {
        log.error(`[${serviceName}] Health Check API call failed! Retrying...`);
      } else {
        log.error(`[${serviceName}] Health Check API call failed!`);
      }
      error = err;
      retry++;
    }
  }

  if (response) {
    log.info(
      `[${serviceName}] Health check for service succeeded. Status : ${response.status}`
    );
    return response.data;
  } else {
    log.error(
      `[${serviceName}] Health check for service failed! Error : ${error}`
    );
    throw new Error('Connection Failed!');
  }
};

export { Service };
