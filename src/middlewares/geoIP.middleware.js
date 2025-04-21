'use strict';

import { logger } from '../utils/index.js';
import geoip from 'geoip-lite';

const log = logger('Middleware: resolve-geo-from-ip');

const fetchGeoDetailsMiddleware = (req, res, next) => {
  log.info('User geo details fetch operation initiated');
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip;

  try {
    const geoDetails = geoip.lookup(ip);

    req.geo = {
      country: geoDetails.country || null,
      region: geoDetails.region || null,
      city: geoDetails.city || null,
      timezone: geoDetails.timezone || 'Asia/Kolkata',
    };
  } catch (err) {
    req.geo = {
      timezone: 'Asia/Kolkata',
    };
  }
  next();
};

export default fetchGeoDetailsMiddleware;
