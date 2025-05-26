'use strict';

import { exec } from './index.js';

const getUserRefreshToken = async (userId) => {
  const query = `SELECT REFRESH_TOKEN FROM USER_METADATA WHERE USER_ID = ?`;
  const params = [userId];
  return exec(query, params);
};

const getUserPrivelegeInfo = async (userId) => {
  const query = `SELECT S.SCOPE_CD
        FROM USERS U
        INNER JOIN ROLE_SCOPE R ON R.ROLE_ID = U.ROLE_ID AND R.IS_DELETED = false
        INNER JOIN USER_SCOPE S ON S.ID = R.SCOPE_ID AND S.IS_DELETED = false
        WHERE U.ID = ? AND U.IS_DELETED = false;`;
  const params = [userId];

  return exec(query, params);
};

const getServiceInfo = async (microservice, protocol) => {
  const query = `SELECT ID, MICROSERVICE, ENVIRONMENT, PROTOCOL, PORT
    FROM SVC_CONFIG
    WHERE MICROSERVICE = ? AND PROTOCOL = ? AND IS_DELETED = false;`;
  const params = [microservice, protocol];

  return exec(query, params);
};

const updateServicePort = async (id, port) => {
  const query = `UPDATE SVC_CONFIG SET PORT = ?, MODIFIED_BY = 'SERVICE_START'
    WHERE ID = ?`;
  const params = [port, id];

  return exec(query, params);
};

const registerNewService = async (microservice, port, protocol) => {
  const query = `INSERT INTO SVC_CONFIG (MICROSERVICE, PROTOCOL, PORT, ENVIRONMENT)
    VALUES (?, ?, ?, ?);`;
  const params = [microservice, protocol, port, 'local'];

  return exec(query, params);
};

export {
  getUserRefreshToken,
  getUserPrivelegeInfo,
  getServiceInfo,
  updateServicePort,
  registerNewService,
};
