'use strict';

import dotenv from 'dotenv';

import {
  buildApiError,
  buildApiResponse,
  logger
} from './src/utils/index.js';
import { errorHandler } from './src/middlewares/index.js';
import { Service, Router } from './src/templates/index.js';

dotenv.config({
  path: './env'
});

export {
  buildApiError,
  buildApiResponse,
  logger,
  errorHandler,
  Service,
  Router
};
