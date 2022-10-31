import { Logger } from '@nestjs/common';
import { RedisConstants } from 'src/socket/constants/redis-constants';
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
