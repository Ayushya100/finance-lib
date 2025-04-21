'use strict';

import { buildApiError } from '../utils/index.js';

const errorHandler = (err, req, res, next) => {
  const apiError = buildApiError(err);
  res.status(err.status).json({
    statusCode: apiError.statusCode,
    message: apiError.message,
    devMessage: apiError.devMessage,
    type: apiError.type,
    errors: apiError.errors,
    data: apiError.data,
    success: apiError.success,
  });
};

export default errorHandler;
