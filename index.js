'use strict';

import dotenv from 'dotenv';

import {
  buildApiError,
  buildApiResponse,
  logger,
  convertIdToPrettyString,
  convertPrettyStringToId,
  convertToNativeTimeZone,
  RequestContext
} from './src/utils/index.js';
import { errorHandler } from './src/middlewares/index.js';
import { Service } from './src/templates/index.js';
import exec from './src/db/dbExec.js';

dotenv.config({
  path: './env'
});

export {
  buildApiError,
  buildApiResponse,
  logger,
  errorHandler,
  Service,
  exec,
  convertIdToPrettyString,
  convertPrettyStringToId,
  convertToNativeTimeZone,
  RequestContext
};
