'use strict';

import { buildApiError } from '../utils/index.js';

const errorHandler = (err, req, res, next) => {
  const apiError = buildApiError(err);

  let errors = [];
  if (Array.isArray(apiError.errors)) {
    errors = apiError.errors.map(e => e?.message || e);
  } else if (apiError.errors instanceof Error) {
    errors = [apiError.errors.message];
  } else if (typeof apiError.errors === 'string') {
    errors = [apiError.errors];
  } else if (apiError.errors) {
    errors = [apiError.errors];
  }

  res.status(err.status).json({
    statusCode: apiError.statusCode,
    message: apiError.message,
    devMessage: apiError.devMessage,
    type: apiError.type,
    errors: errors,
    data: apiError.data,
    stack: apiError.stack,
    success: apiError.success,
  });
};

export default errorHandler;
