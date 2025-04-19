'use strict';

import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as OpenApiValidator from 'express-openapi-validator';
import { logger } from '../utils/index.js';
import { errorHandler } from '../middlewares/index.js';

const log = logger('app-template');

class App {
  constructor(cookieEnable = false, openApiEnabled = true) {
    log.debug('AppTemplate constructor has been called');
    this.app = express();

    this.originPath = process.env.originPath;
    this.apiCallLimit = process.env.apiLimit || 100;
    this.windowSize = process.env.windowSize || 5 * 60 * 1000;
    this.cookieKey = process.env.cookieKey;

    this.cookieEnable = cookieEnable;
    this.openApiEnabled = openApiEnabled;

    this.initializeApp();
    this.initializeOpenAPI();
    this.registerErrorHandler();
  }
}

App.prototype.initializeApp = function () {
  this.app.use(
    express.json({
      limit: '512kb', // Maximum request body size
    })
  );

  this.app.use(
    express.urlencoded({
      limit: '64kb', // Maximum url-body size
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
      limit: this.apiCallLimit, // Limit each IP to the provided number of requests per window size
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

App.prototype.initializeOpenAPI = function () {
  // Initialize OpenAPI
  if (this.openApiEnabled) {
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: openapiSpec,
        validateRequests: true,
        validateResponses: true,
      })
    );
  }
};

App.prototype.registerErrorHandler = function () {
  this.app.use(errorHandler);
};

export { App };
