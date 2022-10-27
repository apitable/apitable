import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { NestInterface as NestInterface } from './nest.interface';
import { isEmpty, isNil } from '@nestjs/common/utils/shared.utils';
import { AuthenticatedSocket } from 'src/socket/interface/socket/authenticated-socket.interface';
import { getSocketServerAddr, ipAddress, logger, randomNum } from 'src/socket/common/helper';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { RedisService } from '../redis/redis.service';
import { SocketRo } from 'src/socket/model/ro/socket.ro';
import { GatewayConstants } from 'src/socket/constants/gateway.constants';
import * as util from 'util';
import { NestCacheKeys } from 'src/socket/enum/redis-key.enum';

@Injectable()
export class NestService implements NestInterface {
  constructor(private readonly redisService: RedisService, private readonly httpService: HttpService) { }
  /**
   * 每个节点保存当前的 nest 的连接
   */
  private socketMap = new Map<string, AuthenticatedSocket>();

  public async setSocket(socket: AuthenticatedSocket) {
    this.socketMap.set(socket.id, socket);
    await this.redisService.saveSocket(SocketConstants.NEST_SERVER_PREFIX, socket.auth.userId, getSocketServerAddr(ipAddress()));
  }

  public async getSocketNotifyUrl() {
    return this.redisService
      .getSockets(SocketConstants.NEST_SERVER_PREFIX)
      .then(result => {
        logger('NestServer:Connection:Redis').debug(result);
        const socketServer: string[] = Array.from(Object.values(result)).filter(value => value != getSocketServerAddr(ipAddress()));
        if (!isEmpty(socketServer)) {
          const index = randomNum(0, socketServer.length - 1);
          return socketServer[index] + GatewayConstants.SOCKET_SERVER_NOTIFY_PATH;
        }
        logger('NestServer:Connection:empty').error(result);
        return null;
      })
      .catch(err => {
        logger('NestServer:Connection:Redis').error(err);
        return null;
      });
  }

  public getSocketId(): string {
    // 先从本地内存中拿取;
    if (this.socketMap.size != 0) {
      const socketIds = Array.from(this.socketMap.keys());
      const index = randomNum(0, socketIds.length - 1);
      return socketIds[index];
    }
    return null;
  }

  async notify(event: string, message: any): Promise<any | null> {
    logger('NestService:notify').debug({ event, message });
    return new Promise(resolve => {
      const socketId = this.getSocketId();
      if (!isNil(socketId)) {
        this.socketMap.get(socketId).emit(event, message, function(answer) {
          logger('NestService:notify:answer').debug({ event, answer });
          return resolve(answer);
        });
      } else {
        logger('NestService:notify:error').log(event, 'This pod no connected to NestServer');
        this.httpNotify(event, message)
          .then(result => {
            logger('NestService:notify:answer').debug({ event, result });
            return resolve(result);
          })
          .catch(error => {
            logger('NestService:notify:error').error(error);
            return resolve(null);
          });
      }
    });
  }

  public async removeSocket(socket: AuthenticatedSocket) {
    this.socketMap.delete(socket.id);
    await this.redisService.removeSocket(SocketConstants.NEST_SERVER_PREFIX, socket.auth.userId);
    logger('NestService:removeSocket').log(socket.auth);
  }

  public async handleHttpNotify(socketRo: SocketRo) {
    return this.notify(socketRo.event, socketRo.message);
  }

  public async httpNotify(event: string, message: any): Promise<any | null> {
    const url = await this.getSocketNotifyUrl();
    if (!isNil(url)) {
      return this.httpService.post(url, { event, message }).toPromise();
    }
    return Promise.reject(null);
  }

  /**
   * 获取资源映射的所有房间
   * @param resourceId 
   */
  async getResourceRelateRoomIds(resourceId: string) : Promise<string[]> {
    const resourceKey = util.format(NestCacheKeys.RESOURCE_RELATE, resourceId);
    return await this.redisService.getSet(resourceKey);
  }

  /**
   * 获取 socket 的信息
   * @param socketIds 
   */
  async getSocketInfos(socketIds: string[]) : Promise<any[]> {
    const ids = socketIds.map(id => util.format(NestCacheKeys.SOCKET, id));
    const raws = await this.redisService.getValues(ids);
    return raws.filter(Boolean).map(raw => JSON.parse(raw));
  }
}
