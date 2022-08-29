import { RedisConstants } from 'src/constants/redis-constants';
import { logger } from 'src/common/helper';
import IORedis = require('ioredis');

export const redisConfig = {
  provide: RedisConstants.REDIS_CONFIG,
  /**
   *
   * @param db 数据库
   * @param clientType 连接client类型 sub/pub/client
   * @param keyPrefix key前缀
   */
  useFactory: (db: number, clientType: string, keyPrefix: string): IORedis.RedisOptions => {
    return {
      host: RedisConstants.HOST,
      port: RedisConstants.PORT,
      password: RedisConstants.PASSWORD,
      db: db,
      retryStrategy(times: number): number | void {
        if (times <= RedisConstants.RE_CONNECT_MAX_TIMES) {
          // reconnect after
          logger(`RedisClient:${clientType}:retryStrategy`).log(times);
          return Math.min(times * 1000, 3000);
        } else {
          logger(`RedisClient:${clientType}:retryStrategy:RetryTimeExhausted`).error(times);
        }
      },
      reconnectOnError(error: Error): boolean | 1 | 2 {
        logger(`RedisClient:${clientType}:reconnectOnError`).error(error);
        return false;
      },
      // 作为socket的咩有这个属性
      keyPrefix: keyPrefix,
      autoResubscribe: true,
      // I had the same problem with Google Firebase Cloud Functions.
      // The problem was that latest version of Redis keep the connections alive forever.
      // If the process that calls Redis ends shortly after it calls Redis as in our case with the Cloud Functions,
      // you have to set the timeout setting to something different than the default 0.
      // redis重连报错，需要设置connectTimeout
      connectTimeout: RedisConstants.CONNECT_TIMEOUT,
      maxRetriesPerRequest: 1,
    };
  },
};
