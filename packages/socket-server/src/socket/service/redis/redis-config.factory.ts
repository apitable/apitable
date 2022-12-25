/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Logger } from '@nestjs/common';
import { RedisConstants } from '../../constants/redis-constants';
import IORedis = require('ioredis');

export const redisConfig = {
  provide: RedisConstants.REDIS_CONFIG,

  /*
   * custom factory
   *
   * @param db database index
   * @param clientType connection client type[sub/pub/client]
   * @param keyPrefix
   */
  useFactory: (db: number, clientType: string, keyPrefix: string): IORedis.RedisOptions => {
    const logger = new Logger('RedisAdapterFactory');

    return {
      host: RedisConstants.HOST,
      port: RedisConstants.PORT,
      password: RedisConstants.PASSWORD,
      db: db,
      retryStrategy(times: number): number | void {
        if (times <= RedisConstants.RE_CONNECT_MAX_TIMES) {
          // reconnect after
          logger.log(`RedisClient:${clientType}:retryStrategy times:${times}`);
          return Math.min(times * 1000, 3000);
        }
        logger.error(`RedisClient:${clientType}:retryStrategy:RetryTimeExhausted times:${times}`);
      },
      reconnectOnError(e: Error): boolean | 1 | 2 {
        logger.error(`RedisClient:${clientType}:reconnectOnError`, e?.stack);
        return false;
      },
      keyPrefix: keyPrefix,
      autoResubscribe: true,
      // I had the same problem with Google Firebase Cloud Functions.
      // The problem was that latest version of Redis keep the connections alive forever.
      // If the process that calls Redis ends shortly after it calls Redis as in our case with the Cloud Functions,
      // you have to set the timeout setting to something different than the default 0.
      // redis reconnection error need to set connectTimeout
      connectTimeout: RedisConstants.CONNECT_TIMEOUT,
      maxRetriesPerRequest: 1,
    };
  },
};
