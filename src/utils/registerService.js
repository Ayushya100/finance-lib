'use strict';

import logger from './logger.js';
import {
  getServiceInfo,
  updateServicePort,
  registerNewService,
} from '../db/index.js';

const log = logger('Util: register-service');

const registerService = async (microservice, port, protocol) => {
  try {
    log.info('Controller function to register service port in db');
    protocol = protocol.trim().toUpperCase();

    log.info('Call db query to fetch the service information if exists');
    let microserviceDtl = await getServiceInfo(microservice, protocol);
    if (microserviceDtl.rowCount === 0) {
      log.info(
        'Call db query to register the new service information in db on service restart'
      );
      await registerNewService(microservice, port, protocol);
    } else {
      log.info('Call db query to update the service port');
      microserviceDtl = microserviceDtl.rows[0];
      const svcId = microserviceDtl.id;
      await updateServicePort(svcId, port);
    }
    log.success('Service registration in db completed successfully');
  } catch (err) {
    if (err.status && err.message) {
      throw err;
    }
    log.error('Error occurred while registering service in db');
    throw {
      status: 500,
      message: 'Error occurred while registering service in db',
      errors: err,
    };
  }
};

export { registerService };
