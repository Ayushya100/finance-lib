'use strict';

import { buildApiError } from '../utils/index.js';

const errorHandler = (err, req, res, next) => {
  res.status(err.status).json(buildApiError(err));
};

export default errorHandler;
