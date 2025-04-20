'use strict';

import { logger } from '../utils/index.js';

const userContext = (req, res, next) => {
  const log = logger('middleware: user-context');

  log.http(`Incoming Request: ${req.method} - ${req.originalUrl}`);
  log.http(`Base URL: ${req.baseUrl || null}`);
  log.http(`Request Protocol: ${req.protocol}`);

  log.verbose(`Request Time: ${new Date(Date.now())}`);

  if (req.rateLimit.limit) {
    log.verbose(`Request Rate Limit: ${req.rateLimit.limit}`);
  }
  if (req.rateLimit.used) {
    log.verbose(`Request Rate Used: ${req.rateLimit.used}`);
  }
  if (req.rateLimit.remaining) {
    log.verbose(`Request Rate Remaining: ${req.rateLimit.remaining}`);
  }
  if (req.rateLimit.resetTime) {
    log.verbose(`Request Rate Reset Time: ${req.rateLimit.resetTime}`);
  }

  if (Object.keys(req.params).length > 0) {
    log.verbose(`Request parameters: ${JSON.stringify(req.params)}`);
  }
  if (Object.keys(req.query).length > 0) {
    log.verbose(`Request parameters: ${JSON.stringify(req.query)}`);
  }

  log.verbose(`Secure Request: ${req.secure}`);
  next();
};

export default userContext;
