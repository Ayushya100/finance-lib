'use strict';

import { logger } from '../utils/index.js';

const log = logger('middleware: verify-userid');

const verifyUserId = (req, res, next) => {
  const userId = req.params?.userId || req.body?.userId;
  if (!userId) {
    log.error('user id not provided');
  }

  if (userId && userId !== req.user.id) {
    next({
      status: 401,
      message: 'Unauthorized access',
      data: [],
      errors: [],
      stack: 'verifyUserId function call',
    });
  }
  next();
};

export default verifyUserId;
