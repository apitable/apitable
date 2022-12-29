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

import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { isEmpty, isNil } from '@nestjs/common/utils/shared.utils';
import { getSocketServerAddr, ipAddress, randomNum } from 'socket/common/helper';
import { GatewayConstants } from 'socket/constants/gateway.constants';
import { SocketConstants } from 'socket/constants/socket-constants';
import { NestCacheKeys } from 'socket/enum/redis-key.enum';
import { AuthenticatedSocket } from 'socket/interface/socket/authenticated-socket.interface';
import { SocketRo } from 'socket/model/ro/socket.ro';
import * as util from 'util';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class NestService {
  private readonly logger = new Logger(NestService.name);

  constructor(private readonly redisService: RedisService, private readonly httpService: HttpService) {}

  // each node holds the connection of the current nest
  private socketMap = new Map<string, AuthenticatedSocket>();

  async setSocket(socket: AuthenticatedSocket) {
    this.socketMap.set(socket.id, socket);
    await this.redisService.saveSocket(SocketConstants.NEST_SERVER_PREFIX, socket.auth.userId, getSocketServerAddr(ipAddress()));
  }

  async removeSocket(socket: AuthenticatedSocket) {
    this.socketMap.delete(socket.id);
    await this.redisService.removeSocket(SocketConstants.NEST_SERVER_PREFIX, socket.auth.userId);
    this.logger.log(`NestService:removeSocket ${socket.auth}`);
  }

  async handleHttpNotify(socketRo: SocketRo) {
    return await this.notify(socketRo.event, socketRo.message);
  }

  /**
   * Get all rooms for resource mapping
   *
   * @param resourceId
   */
  async getResourceRelateRoomIds(resourceId: string): Promise<string[]> {
    const resourceKey = util.format(NestCacheKeys.RESOURCE_RELATE, resourceId);
    return await this.redisService.getSet(resourceKey);
  }

  /**
   * Get socket information
   *
   * @param socketIds
   */
  async getSocketInfos(socketIds: string[]): Promise<any[]> {
    const ids = socketIds.map(id => util.format(NestCacheKeys.SOCKET, id));
    const raws = await this.redisService.getValues(ids);
    return raws.filter(Boolean).map(raw => JSON.parse(raw));
  }

  private async getSocketNotifyUrl() {
    return await this.redisService
      .getSockets(SocketConstants.NEST_SERVER_PREFIX)
      .then(result => {
        this.logger.log(`NestServer:Connection:Redis ${JSON.stringify(result)}`);
        const socketServer: string[] = Array.from(Object.values(result)).filter(value => value != getSocketServerAddr(ipAddress()));
        if (!isEmpty(socketServer)) {
          const index = randomNum(0, socketServer.length - 1);
          return socketServer[index] + GatewayConstants.SOCKET_SERVER_NOTIFY_PATH;
        }
        this.logger.warn(`NestServer:Connection:empty ${JSON.stringify(result)}`);
        return null;
      })
      .catch(e => {
        this.logger.error('NestServer:Connection:Redis', e?.stack);
        return null;
      });
  }

  private async httpNotify(event: string, message: any): Promise<any | null> {
    const url = await this.getSocketNotifyUrl();
    if (!isNil(url)) {
      return this.httpService.post(url, { event, message }).toPromise();
    }
    return Promise.reject(null);
  }

  private getSocketId(): string {
    // First fetch from local memory
    if (this.socketMap.size != 0) {
      const socketIds = Array.from(this.socketMap.keys());
      const index = randomNum(0, socketIds.length - 1);
      return socketIds[index];
    }
    return null;
  }

  private async notify(event: string, message: any): Promise<any | null> {
    this.logger.debug({ event, message });
    return await new Promise(resolve => {
      const socketId = this.getSocketId();
      if (!isNil(socketId)) {
        this.socketMap.get(socketId).emit(event, message, function(answer) {
          // this.logger.debug({ event, answer });
          return resolve(answer);
        });
      } else {
        this.logger.warn(`${event} This pod no connected to NestServer`);
        this.httpNotify(event, message)
          .then(result => {
            this.logger.debug({ event, result });
            return resolve(result);
          })
          .catch(e => {
            this.logger.error('NestService:notify:error', e?.stack);
            return resolve(null);
          });
      }
    });
  }
}
