'use strict';

import dotenv from 'dotenv';

import {
  buildApiError,
  buildApiResponse,
  logger,
  convertIdToPrettyString,
  convertPrettyStringToId,
  convertToNativeTimeZone,
  RequestContext,
  sendMail
} from './src/utils/index.js';
import { errorHandler, verifyUserId } from './src/middlewares/index.js';
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
  RequestContext,
  sendMail,
  verifyUserId
};
