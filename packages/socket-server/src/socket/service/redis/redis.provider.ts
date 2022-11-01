import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisConstants } from '../../constants/redis-constants';
import { redisConfig } from './redis-config.factory';

export type RedisClient = Redis;

export const redisProviders: Provider[] = [
  {
    useFactory: (): RedisClient => {
      return new Redis(redisConfig.useFactory(RedisConstants.REDIS_DB, RedisConstants.REDIS_CLIENT, RedisConstants.REDIS_PREFIX));
    },
    provide: RedisConstants.REDIS_CLIENT,
  },
];
