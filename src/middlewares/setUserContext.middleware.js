'use strict';

import { RequestContext } from '../utils/index.js';

const requestContextMiddleware = (req, res, next) => {
  const userData = {
    country: req.geo.country || null,
    region: req.geo.region || null,
    city: req.geo.city || null,
    timezone: req.geo.timezone || 'Asia/Kolkata',
    language: 'eng',
  };

  RequestContext.run(userData, () => {
    next();
  });
};

export default requestContextMiddleware;
