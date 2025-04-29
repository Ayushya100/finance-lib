'use strict';

import jwt from 'jsonwebtoken';
import { logger } from '../utils/index.js';

const log = logger('middleware: verify-token');

const verifyToken = (req, res, next) => {
  try {
    log.info('Token verification operation initiated');
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      log.error('Token not received. Cannot proceed further!');
      next({
        status: 400,
        message: 'User not authorized',
        data: [],
        errors: [],
        stack: 'verifyToken function call',
      });
    }

    const tokenKey = process.env.ACCESS_TOKEN_KEY;
    const decodedToken = jwt.verify(token, tokenKey);
    req.user = {
      id: decodedToken.id,
      username: decodedToken.username,
      role: decodedToken.role,
      isVerified: decodedToken.isVerified,
    };

    log.success('Token verification completed successfully');
    next();
  } catch (err) {
    next({
      status: 401,
      message: 'User authentication token expired',
      data: [],
      errors: err,
      stack: err.stack,
    });
  }
};

export default verifyToken;
