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

import { Inject, Injectable } from '@nestjs/common';
import { RedisConstants } from 'shared/common/constants/socket.module.constants';
import { SocketCache, UserRoom } from 'shared/enums/redis-key.enum';
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
  async saveUserSocketId(userId: string, socketId: string): Promise<[error: Error | null, result: unknown][] | null> {
    const key: string = UserRoom.PREFIX + userId;
    // `sadd` adds set collection elements, returns true, repeatedly returns false
    return await this.redis
      .multi()
      .sadd(key, socketId)
      .expire(key, UserRoom.EXPIRE)
      .exec();
  }

  /**
   * remove cached socket id
   *
   * @param userId
   * @param socketId
   */
  removeUserSocketId(userId: string, socketId: string) {
    const key: string = UserRoom.PREFIX + userId;
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
    return await this.redis.hset(SocketCache.PREFIX + prefix, key, value);
  }

  /**
   * Get the socket connection corresponding to the ip Address
   *
   * @param prefix
   */
  async getSockets(prefix: string): Promise<Record<string, string>> {
    return await this.redis.hgetall(SocketCache.PREFIX + prefix);
  }

  /**
   * delete socket information
   *
   * @param prefix
   * @param key
   */
  async removeSocket(prefix: string, key: string) {
    return await this.redis.hdel(SocketCache.PREFIX + prefix, key);
  }

}
