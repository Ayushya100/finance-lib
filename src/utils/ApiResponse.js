'use strict';

import { responseCodes, responseMessage } from '../assets/response-codes';

/*
 * ApiResponse class to handle all the responses
 * @param {number}
 * @param {string}
 * @param {string}
 * @param {string}
 * @param {array[object]}
 * @returns {} - returns nothing.
 */

class ApiResponse {
  constructor(
    statusCode,
    type,
    message = 'Success',
    devMessage = 'SUCCESS',
    data = []
  ) {
    this.statusCode = statusCode;
    this.type = type;
    this.message = message;
    this.devMessage = devMessage;
    this.data = data;
    this.success = statusCode < 400;
  }
}

const buildApiResponse = (res) => {
  const apiResponse = new ApiResponse(
    res.status || 500,
    responseCodes[res.status],
    res.message,
    responseMessage[res.status],
    res.data || []
  );

  return apiResponse;
};

export { buildApiResponse };
