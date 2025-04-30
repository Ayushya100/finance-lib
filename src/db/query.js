'use strict';

import { exec } from './index.js';

const getUserRefreshToken = async(userId) => {
    const query = `SELECT REFRESH_TOKEN FROM USER_METADATA WHERE USER_ID = ?`;
    const params = [userId];
    return exec(query, params);
}

export { getUserRefreshToken };
