import { RedisService } from '@vikadata/nestjs-redis';
import { Injectable } from '@nestjs/common';
import * as util from 'util';
import { CacheKeys, STORAGE_EXPIRE_TIME } from '../../common';

/**
 * Abstract class for client storage, based on Redis.
 */
@Injectable()
export class ClientStorage {
  constructor(
    private readonly redisService: RedisService,
  ) { }

  /**
   * Obtain socket info by socket ID
   */
  async get<T = object>(socketId: string): Promise<T | null> {
    const client = this.redisService.getClient();
    const cacheKey = util.format(CacheKeys.SOCKET, socketId);
    const raw = await client.get(cacheKey);
    if (raw) {
      return JSON.parse(raw);
    }
    return null;
  }

  /**
   * Obtain socket infos by an array of socket IDs
   */
  async mget<T>(socketIds: string[]): Promise<T[]> {
    const client = this.redisService.getClient();
    const ids = socketIds.map(id => util.format(CacheKeys.SOCKET, id));
    const raws = await client.mget(...ids);
    return raws.map(raw => {
      if (raw) {
        return JSON.parse(raw);
      }
      return null;
    });
  }

  /**
   * Set the socket connection info in Redis
   *
   * @param socketId socket ID
   * @param data socket connection info
   */
  async set(socketId: string, data: object) {
    const client = this.redisService.getClient();
    const cacheKey = util.format(CacheKeys.SOCKET, socketId);
    // After the server restarts, all socket IDs are invalidated, but there is no good means to
    // clear them, so a 3-day expiry time is set.
    // If a user never switch datasheet/refresh the datasheet, its collaborator info will be lost.
    // But there is no other impact
    return await client.set(cacheKey, JSON.stringify(data), 'EX', STORAGE_EXPIRE_TIME);
  }

  /**
   * Delete socket connection info
   */
  async del(socketId: string) {
    const client = this.redisService.getClient();
    const cacheKey = util.format(CacheKeys.SOCKET, socketId);
    return await client.del(cacheKey);
  }
}
