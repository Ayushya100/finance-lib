'use strict';

import { logger } from '../utils/index.js';

class Router {
  constructor(header) {
    this.header = header;

    let msg = this.header.split('-');
    msg =
      msg.length > 0
        ? msg
            .map((word) => {
              return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ')
        : msg;
    msg = `${msg} Router initiated`;

    this.log = logger(`Router: ${this.header}`);
    this.msg = msg;
  }
}

Router.prototype.logRequest = function (req) {
  this.log.info(`Incoming request : ${req.method} - ${req.originalUrl}`);

  if (Object.keys(req.params).length > 0) {
    this.log.info(`Request parameters : ${JSON.stringify(req.params)}`);
  }

  if (Object.keys(req.query).length > 0) {
    this.log.info(`Request query : ${JSON.stringify(req.query)}`);
  }
};

Router.prototype.logMsg = function () {
  this.log.info(this.msg);
};

Router.prototype.logInfo = function (type, msg) {
  if (type === 'info') {
    this.log.info(msg);
  } else if (type === 'debug') {
    this.log.debug(msg);
  } else if (type === 'warning') {
    this.log.warning(msg);
  } else if (type === 'success') {
    this.log.success(msg);
  } else {
    this.log.error(msg);
  }
};

export { Router };
