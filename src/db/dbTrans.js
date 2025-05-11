'use strict';

import { performance } from 'perf_hooks';

import { db } from './index.js';
import { logger } from '../utils/index.js';

const log = logger('db');

const trxRunner = async (transactionLogicFn) => {
  const trx = await db.transaction();

  try {
    const execute = async (query, params = []) => {
      log.debug(`Transaction Input Query: ${query}`);
      log.debug(`Transaction Input Params: ${params}`);
      log.info('Transaction Query execution begins');

      // Tracker Initiated
      const startMemo = process.memoryUsage().heapUsed / 1024 / 1024;
      const startTime = performance.now();

      const result = await trx.raw(query, params);
      log.info('Transaction Query execution completed');

      // Tracker Finalized
      const endMemo = process.memoryUsage().heapUsed / 1024 / 1024;
      const endTime = performance.now();

      log.info(
        `Query execution performance result - Memory Consumption: ${Math.abs(endMemo - startMemo).toFixed(2)} MB. Time Consumption: ${Math.abs(endTime - startTime).toFixed(2)} ms`
      );

      return {
        rowCount: result.rowCount,
        rows: result.rows,
      };
    };

    const result = await transactionLogicFn(execute);
    await trx.commit();
    return result;
  } catch (err) {
    await trx.rollback();
    log.error(`Transaction failed: ${err}`);
    throw {
      status: 500,
      message: 'An error occurred while executing the queries.',
      data: [],
      errors: err,
      stack: err.stack,
    };
  }
};

export default trxRunner;
