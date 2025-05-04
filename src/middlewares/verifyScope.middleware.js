'use strict';

import { logger } from '../utils/index.js';

const log = logger('middleware: verify-scope');

const verifyScope = (scope) => async (req, res, next) => {
  try {
    log.info('Scope verification operation initiated');
    const userScopes = req.user.scopes;

    if (!userScopes.includes(scope)) {
      log.error('User dont have the mandatory scope. Cannot proceed');
      next({
        status: 403,
        message: 'User authorization failed',
        data: [],
        errors: [],
        stack: 'verifyScope function call',
      });
    }

    log.success('Scope verification completed successfully');
    next();
  } catch (err) {
    log.error('Scope not available');
    next({
      status: 403,
      message: 'User authorization failed',
      data: [],
      errors: err,
      stack: err.stack,
    });
  }
};

export default verifyScope;
