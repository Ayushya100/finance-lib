'use strict';

import { logger } from '../utils/index.js';

const log = logger('middleware: verify-role');

const verifyRole = (role) => async (req, res, next) => {
  try {
    log.info('Role verification operation initiated');
    const userRole = req.user.role;

    if (userRole !== role) {
      log.error('User dont have the required role. Cannot proceed');
      next({
        status: 403,
        message: 'User authorization failed',
        data: [],
        errors: [],
        stack: 'verifyRole function call',
      });
    }
  } catch (err) {
    log.error('Role not available');
    next({
      status: 403,
      message: 'User authorization failed',
      data: [],
      errors: err,
      stack: err.stack,
    });
  }
};

export default verifyRole;
