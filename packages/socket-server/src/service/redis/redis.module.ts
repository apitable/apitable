import { Global, Module } from '@nestjs/common';
import { redisProviders } from './redis.provider';
import { RedisService } from './redis.service';
import { redisConfig } from './redis-config.factory';

@Global()
@Module({
  providers: [...redisProviders, RedisService, redisConfig],
  exports: [...redisProviders, RedisService],
})
export class RedisModule {}
