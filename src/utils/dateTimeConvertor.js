'use strict';

import { DateTime } from 'luxon';
import { RequestContext } from './index.js';

const convertToNativeTimeZone = (serverDateStr) => {
  const userContext = RequestContext.get();
  const userTimezone = userContext.timezone;

  const userLocalDate = DateTime.fromJSDate(new Date(serverDateStr))
    .setZone(userTimezone)
    .toFormat('dd-MM-yyyy HH:mm:ss');
  return userLocalDate;
};

export { convertToNativeTimeZone };
