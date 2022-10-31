import { Inject, Injectable } from '@nestjs/common';
import { RedisConstants } from 'src/socket/constants/redis-constants';
import { SOCKET_CACHE, USER_ROOM } from 'src/socket/enum/redis-key.enum';
import { IRedisService } from './i-redis-service.interface';
import { RedisClient } from './redis.provider';

@Injectable()
export class RedisService implements IRedisService {
  constructor(
    @Inject(RedisConstants.REDIS_CLIENT) public readonly redis: RedisClient
  ) {}

  public async saveUserSocketId(userId: string, socketId: string): Promise<[Error | null, any][]> {
    const key: string = USER_ROOM.PREFIX + userId;
    // `sadd` adds set collection elements, returns true, repeatedly returns false
    return this.redis
      .multi()
      .sadd(key, socketId)
      .expire(key, USER_ROOM.EXPIRE)
      .exec();
  }

  public async saveValue(key: string, value: string, ex: number | string) {
    await this.redis.set(key, value, 'EX', ex);
  }

  public removeUserSocketId(userId: string, socketId: string) {
    const key: string = USER_ROOM.PREFIX + userId;
    return this.redis.srem(key, socketId);
  }

  public getValue(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  public async getValues(keys: string[]): Promise<any[] | null> {
    return await this.redis.mget(...keys);
  }

  public async getSet(key: string): Promise<any[]> {
    return await this.redis.smembers(key);
  }

  getStatus() {
    return this.redis.status;
  }

  public async saveSocket(prefix: string, key: string, value: string) {
    return this.redis.hset(SOCKET_CACHE.PREFIX + prefix, key, value);
  }

  public async getSockets(prefix: string): Promise<Record<string, string>> {
    return this.redis.hgetall(SOCKET_CACHE.PREFIX + prefix);
  }

  public async removeSocket(prefix: string, key: string) {
    return this.redis.hdel(SOCKET_CACHE.PREFIX + prefix, key);
  }

  public getClient() {
    return this.redis;
  }
}
