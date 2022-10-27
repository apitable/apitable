import { Global, Module } from '@nestjs/common';
import { redisProviders } from '../service/redis/redis.provider';
import { RedisService } from '../service/redis/redis.service';
import { redisConfig } from '../service/redis/redis-config.factory';

@Global()
@Module({
  providers: [...redisProviders, RedisService, redisConfig],
  exports: [...redisProviders, RedisService],
})
export class RedisModule {}
