import { RedisService } from '@vikadata/nestjs-redis';
import { Injectable } from '@nestjs/common';
import * as util from 'util';
import { CacheKeys, STORAGE_EXPIRE_TIME } from '../../common';

/**
 * 客户端存储抽象类
 * 基于Redis实现
 */
@Injectable()
export class ClientStorage {
  constructor(
    private readonly redisService: RedisService,
  ) { }

  /**
   * 根据socketId获取socket信息
   *
   * @param socketId socket连接唯一标识
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
   * 批量根据socketId获取socket信息
   *
   * @param socketIds socket连接唯一标识集合
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
   * 设置socket连接信息到redis
   *
   * @param socketId socket连接唯一标识
   * @param data socket连接信息
   */
  async set(socketId: string, data: object) {
    const client = this.redisService.getClient();
    const cacheKey = util.format(CacheKeys.SOCKET, socketId);
    // 在服务端重启的时候，所有的 socketId 都会失效，并且没有很好的机制去清除他们，所以这里设定一个 3 天的过期时间。
    // 假设一个用户 3 天不曾切换表/刷新表，就会失去他的协作者信息。但并不会造成其他影响。
    return await client.set(cacheKey, JSON.stringify(data), 'EX', STORAGE_EXPIRE_TIME);
  }

  /**
   * 删除socket连接信息
   *
   * @param socketId socket连接唯一标识
   */
  async del(socketId: string) {
    const client = this.redisService.getClient();
    const cacheKey = util.format(CacheKeys.SOCKET, socketId);
    return await client.del(cacheKey);
  }
}
