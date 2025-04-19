'use strict';

import dotenv from 'dotenv';

import {
  buildApiError,
  buildApiResponse,
  logger
} from "./src/utils/index.js";
import errorHandler from "./src/middlewares/index.js";
import { App } from './src/templates/index.js';

dotenv.config({
  path: './env'
});

export default {
  buildApiError,
  buildApiResponse,
  logger,
  errorHandler,
  App
};
