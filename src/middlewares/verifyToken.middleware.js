'use strict';

import jwt from 'jsonwebtoken';
import { logger, convertPrettyStringToId } from '../utils/index.js';
import { getUserRefreshToken } from '../db/index.js';

const log = logger('middleware: verify-token');

const verifyToken = async(req, res, next) => {
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
    const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
    const decodedToken = jwt.verify(token, tokenKey);
    req.user = {
      id: decodedToken.id,
      username: decodedToken.username,
      role: decodedToken.role,
      isVerified: decodedToken.isVerified,
    };

    log.info('Verify if the user has active refresh token or not');
    let refreshToken = await getUserRefreshToken(convertPrettyStringToId(req.user.id));
    refreshToken = refreshToken.rows[0].refresh_token;
    if (!refreshToken || !(jwt.verify(refreshToken, refreshTokenKey))) {
      log.error('Token not valid');
      next({
        status: 401,
        message: 'User authentication token expired',
        data: [],
        errors: err,
        stack: err.stack,
      });
    }

    log.success('Token verification completed successfully');
    next();
  } catch (err) {
    log.error('Token not valid');
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
