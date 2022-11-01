import { Inject, Injectable } from '@nestjs/common';
import { RedisConstants } from '../../constants/redis-constants';
import { SOCKET_CACHE, USER_ROOM } from '../../enum/redis-key.enum';
import { RedisClient } from './redis.provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject(RedisConstants.REDIS_CLIENT) public readonly redis: RedisClient
  ) {}

  getClient() {
    return this.redis;
  }

  getStatus() {
    return this.redis.status;
  }

  /**
   * store socket id in redis
   *
   * @param userId
   * @param socketId
   */
  async saveUserSocketId(userId: string, socketId: string): Promise<[Error | null, any][]> {
    const key: string = USER_ROOM.PREFIX + userId;
    // `sadd` adds set collection elements, returns true, repeatedly returns false
    return this.redis
      .multi()
      .sadd(key, socketId)
      .expire(key, USER_ROOM.EXPIRE)
      .exec();
  }

  /**
   * remove cached socket id
   *
   * @param userId
   * @param socketId
   */
  removeUserSocketId(userId: string, socketId: string) {
    const key: string = USER_ROOM.PREFIX + userId;
    return this.redis.srem(key, socketId);
  }

  /**
   * save value to cache
   *
   * @param key
   * @param value
   * @param ex
   */
  async saveValue(key: string, value: string, ex: number | string) {
    await this.redis.set(key, value, 'EX', ex);
  }

  /**
   * get cached data
   *
   * @param key
   */
  getValue(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  /**
   * get cached data in batches
   *
   * @param keys
   */
  async getValues(keys: string[]): Promise<any[] | null> {
    return await this.redis.mget(...keys);
  }

  /**
   * get set type data
   *
   * @param key
   */
  async getSet(key: string): Promise<any[]> {
    return await this.redis.smembers(key);
  }

  /**
   * Save the socket information of the server for sending confirmation messages
   *
   * @param prefix
   * @param key
   * @param value socket connection user id
   */
  async saveSocket(prefix: string, key: string, value: string) {
    return this.redis.hset(SOCKET_CACHE.PREFIX + prefix, key, value);
  }

  /**
   * Get the socket connection corresponding to the ip Address
   *
   * @param prefix
   */
  async getSockets(prefix: string): Promise<Record<string, string>> {
    return this.redis.hgetall(SOCKET_CACHE.PREFIX + prefix);
  }

  /**
   * delete socket information
   *
   * @param prefix
   * @param key
   */
  async removeSocket(prefix: string, key: string) {
    return this.redis.hdel(SOCKET_CACHE.PREFIX + prefix, key);
  }

}
