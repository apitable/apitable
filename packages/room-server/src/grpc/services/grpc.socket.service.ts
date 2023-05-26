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

import { ICollaborator, OtErrorCode } from '@apitable/core';
import { RedisService } from '@apitable/nestjs-redis';
import { Span } from '@metinseylan/nestjs-opentelemetry';
import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as Sentry from '@sentry/node';
import { showAnonymous } from 'app.environment';
import { IRoomChannelMessage } from 'database/ot/interfaces/ot.interface';
import { OtService } from 'database/ot/services/ot.service';
import { ResourceService } from 'database/resource/services/resource.service';
import { RoomResourceRelService } from 'database/resource/services/room.resource.rel.service';
import { ApiResponse } from 'fusion/vos/api.response';
import { NodeService } from 'node/services/node.service';
import { NodeShareSettingService } from 'node/services/node.share.setting.service';
import { CommonStatusMsg, InjectLogger, sleep } from 'shared/common';
import { APPLICATION_NAME, BootstrapConstants } from 'shared/common/constants/bootstrap.constants';
import { RedisConstants } from 'shared/common/constants/socket.module.constants';
import { PermissionException, ServerException } from 'shared/exception';
import { getIPAddress } from 'shared/helpers/system.helper';
import { IAuthHeader } from 'shared/interfaces';
import { ClientStorage } from 'shared/services/socket/client.storage';
import { IClientRoomChangeResult, IWatchRoomMessage } from 'shared/services/socket/socket.interface';
import { UserService } from 'user/services/user.service';
import { Logger } from 'winston';

/**
 *
 * Socket client service
 *
 * Initialize and listen on socket events after the service is started.
 *
 * Implemented OnApplicationBootstrap interface to customize initialzation after the app starts.
 */
@Injectable()
export class GrpcSocketService implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly relService: RoomResourceRelService,
    private readonly userService: UserService,
    private readonly nodeService: NodeService,
    private readonly nodeShareSettingService: NodeShareSettingService,
    private readonly otService: OtService,
    private readonly clientStorage: ClientStorage,
    @InjectLogger() private readonly logger: Logger,
    private readonly redisService: RedisService,
  ) {
  }

  /**
   * Applies pub/sub mechanism here to ensure the IP registry is real-time.
   *
   * Redis is maintained by socket service.
   *
   * Application is not started if registry failed.
   *
   * registry mechanism is enabled only with APPLICATION_NAME = ROOM_SERVER
   */
  async onApplicationBootstrap() {
    if ('ROOM_SERVER' === APPLICATION_NAME) {
      let published = false;
      // max retry time is 10
      let maxTimes = 0;
      do {
        try {
          const number = await this.publishIp(1);
          published = !!number;
        } catch (error) {
          published = false;
        }
        maxTimes++;
        await sleep(500 * maxTimes);
      } while (!published && maxTimes < 5);
      // TODO consider notifying the developer that registry was failed after max retry time is exceeded.
    }
  }

  async onApplicationShutdown(signal?: string): Promise<any> {
    if ('ROOM_SERVER' === APPLICATION_NAME) {
      let published = false;
      // max retry time is 10
      let maxTimes = 0;
      do {
        try {
          const number = await this.publishIp(0);
          published = !!number;
        } catch (error) {
          published = false;
        }
        maxTimes++;
        await sleep(500 * maxTimes);
      } while (!published && maxTimes < 3);
      // TODO consider notifying the developer that leaving room was failed after max retry time is exceeded.
    }
    return Promise.resolve(signal);
  }

  public errorCatch(e: unknown, message: any): any {
    // may be OtException or other exceptions
    const statusCode = e instanceof ServerException ? e.getCode() : OtErrorCode.SERVER_ERROR;
    const errMsg = e instanceof ServerException ? e.getMessage() : CommonStatusMsg.DEFAULT_ERROR_MESSAGE;
    this.logger.error('Handles OT data change exception ', { stack: (e as any)?.stack || errMsg, code: (e as any)?.code || statusCode });
    if (!(e instanceof ServerException)) {
      // Filter exception that isn't necessary to be reported.
      message.cookie = undefined;
      message.token = undefined;
      Sentry.captureException(e, { extra: { message }});
    }
    return ApiResponse.error(errMsg, statusCode);
  }

  private async timeLogger<T>(key: string, func: string, promise: Promise<T>) {
    const start = Date.now();
    const result = await promise;
    const end = Date.now();
    this.logger.info(`${key} TIME [${func}]: ${end - start}ms`, {
      logger: key,
      func: func,
      time: end - start,
    });
    return result;
  }

  private async watchRoomLogger<T>(func: string, promise: Promise<T>) {
    return await this.timeLogger('WATCH_ROOM', func, promise);
  }

  /**
   * Join the user in collaboration room
   *
   * @param message User message
   * @param clientId client ID
   * @param socketIds socket connection ID collection
   * @param metadata grpc metadata
   */
  public async watchRoom(message: IWatchRoomMessage, clientId: string, socketIds: string[], _metadata: any) {
    const createTime = Date.now();
    let userId: string;
    let collaborator;
    let spaceId;
    this.logger.info(`Watch Room: ${message.roomId}, ShareId: ${message.shareId} | ClientId: ${clientId}`);
    const nodeId = await this.watchRoomLogger('getNodeIdByResourceId', this.resourceService.getNodeIdByResourceId(message.roomId));
    if (!nodeId) {
      throw new ServerException(PermissionException.NODE_NOT_EXIST);
    }
    // reject template node watching
    const isTemplate = await this.watchRoomLogger('isTemplate', this.nodeService.isTemplate(nodeId));
    if (isTemplate) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
    if (message.shareId || message.embedLinkId) {
      if (message.shareId) {
        // authorize share link
        await this.watchRoomLogger('checkNodeHasOpenShare', this.nodeShareSettingService.checkNodeHasOpenShare(message.shareId, nodeId));
      }
      const { uuid } = await this.watchRoomLogger('getMeNullable', this.userService.getMeNullable(message.cookie || ''));
      userId = uuid;
    } else {
      // authorize space link
      const user = await this.watchRoomLogger('getMe', this.userService.getMe({ cookie: message.cookie }));
      // check if the current user is in the this space
      await this.watchRoomLogger('checkUserForNode', this.nodeService.checkUserForNode(user.userId, nodeId));
      // validate node permission
      await this.watchRoomLogger('checkNodePermission', this.nodeService.checkNodePermission(nodeId, { cookie: message.cookie }));
      userId = user.uuid;
    }
    // store current user info
    await this.watchRoomLogger('set', this.clientStorage.set(clientId, { userId, socketId: clientId, createTime, shareId: message.shareId }));
    // Obtain collaborator list of the room, ordered by join-time.
    let collaborators = (await this.watchRoomLogger('mget', this.clientStorage.mget<ICollaborator>(socketIds))).filter(Boolean).sort();
    // Filter users who are not logged in
    const roomUserIds = collaborators.map(collaborator => collaborator.userId).filter(Boolean);
    if (roomUserIds.length) {
      spaceId = await this.watchRoomLogger('getSpaceIdByNodeId', this.nodeService.getSpaceIdByNodeId(nodeId));
      const userInfos = await this.watchRoomLogger('getUserInfo', this.userService.getUserInfo(spaceId, roomUserIds as string[]));
      // Fill in info for logged-in users.
      collaborators
        .filter(collaborator => collaborator.userId)
        .forEach(collaborator => {
          const user = userInfos.find(user => collaborator.userId === user.userId);
          if (!user) {
            return;
          }
          collaborator.avatar = user.avatar;
          collaborator.userName = user.name;
          // Only space member has unitId. Name means member nickname, empty for member not in space
          collaborator.memberName = 'unitId' in user ? user!.name : '';
          collaborator.avatarColor = user.avatarColor;
          collaborator.nickName = user.nickName;
        });
      // Current user info
      if (userId) {
        collaborator = collaborators.find(collaborator => collaborator.userId === userId);
      }
    }
    // filter anonymous person in embed
    if (!showAnonymous) {
      collaborators = collaborators.filter(i => i.userId);
    }
    // Obtain latest revision numbers of resources in the room
    const resourceRevisions = await this.watchRoomLogger('getResourceRevisions', this.relService.getResourceRevisions(message.roomId));
    const endTime = +new Date();
    this.logger.info(`Watch Room: ${message.roomId} Success, duration: ${endTime - createTime}ms | uuid: ${userId} | SocketIds: ${socketIds}`);
    return { resourceRevisions, collaborators, collaborator, spaceId };
  }

  /**
   * Helper function for watchRoom, supports obtaining all user infos of active users in the current room cross-pod-ly
   *
   * @param {IWatchRoomMessage} message
   * @param {string} spaceId
   * @param {string[]} socketIds
   * @returns {Promise<{collaborators: ICollaborator[]}>}
   */
  async getActiveCollaborators(spaceId: string, socketIds: string[]) {
    if (!spaceId) {
      throw new ServerException(PermissionException.NODE_NOT_EXIST);
    }

    // Obtain collaborator list of the room, ordered by join-time.
    let collaborators = (await this.clientStorage.mget<ICollaborator>(socketIds)).filter(Boolean).sort();
    // Filter users who are not logged in
    const roomUserIds = collaborators.map(collaborator => collaborator.userId).filter(Boolean);
    if (roomUserIds.length) {
      const userInfos = await this.userService.getUserInfo(spaceId, roomUserIds as string[]);
      // Fill in info for logged-in users.
      collaborators
        .filter(collaborator => collaborator.userId)
        .forEach(collaborator => {
          const user = userInfos.find(user => collaborator.userId === user.userId);
          if (!user) {
            return;
          }
          collaborator.avatar = user.avatar;
          collaborator.userName = user.name;
          // Only members in space has unitId. name means member nickname, empty name for members not in space
          collaborator.memberName = 'unitId' in user ? user!.name : '';
          collaborator.avatarColor = user.avatarColor;
          collaborator.nickName = user.nickName;
        });
    }
    if (!showAnonymous) {
      collaborators = collaborators.filter(i => i.userId);
    }
    return { collaborators };
  }

  private async roomChangeLogger<T>(func: string, promise: Promise<T>) {
    return await this.timeLogger('CLIENT_ROOM_CHANGE', func, promise);
  }

  /**
   * User changes node contents in the room
   */
  @Span()
  public async roomChange(message: IRoomChannelMessage, auth: IAuthHeader): Promise<IClientRoomChangeResult[]> {
    this.logger.info(
      `Start processing CLIENT_ROOM_CHANGE,room:[${message.roomId}],shareId: ${message.shareId},changesets length:[${message.changesets.length}]`,
    );
    const beginTime = +new Date();
    const changesets = await this.roomChangeLogger('applyRoomChangeset', this.otService.applyRoomChangeset(message, auth));
    const data = await this.roomChangeLogger('getRoomChangeResult', this.relService.getRoomChangeResult(message.roomId, changesets));
    const endTime = +new Date();
    this.logger.info(`room:[${message.roomId}] Finished CLIENT_ROOM_CHANGE, duration: ${endTime - beginTime}ms`);
    return data;
  }

  /**
   * User leaves collaboration room
   */
  public leaveRoom(clientId: string) {
    return this.clientStorage.del(clientId);
  }

  async publishIp(action: number): Promise<number> {
    const ipAddress = getIPAddress();
    const data: IPublishRoomAddressMessage = {
      address: `${ipAddress}:${BootstrapConstants.ROOM_GRPC_PORT}:${BootstrapConstants.SERVER_PORT}`,
      action
    };
    const message = JSON.stringify(data);
    try {
      // Ensure stability of Redis connection
      const redis = this.redisService.getClient().duplicate();
      const number = await redis.publish(RedisConstants.ROOM_POOL_CHANNEL, message);
      if (!number) {
        this.logger.warn({
          message: 'socket service isn\'t started',
          channel: RedisConstants.ROOM_POOL_CHANNEL,
          number
        });
      } else {
        this.logger.info(`Room Client(grpc) [${ipAddress}:${BootstrapConstants.ROOM_GRPC_PORT}] publish succeeded`,
          { action: data.action, channel: RedisConstants.ROOM_POOL_CHANNEL }
        );
      }
      // Disconnect manually
      redis.disconnect();
      return number;
    } catch (e) {
      this.logger.info(`Room Client(grpc) [${ipAddress}:${BootstrapConstants.ROOM_GRPC_PORT}] publish failed`,
        { e: (e as Error).message, stack: (e as Error)?.stack, message }
      );
      throw e;
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  public async intervalReportAliveStatus() {
    if ('ROOM_SERVER' === APPLICATION_NAME) {
      await this.publishIp(1);
    }
  }
}

interface IPublishRoomAddressMessage {
  // format : ip:port(grpc):checkHealthyPort ;
  // example: 127.0.0.1:3334:3333 ;
  address: string;
  action: number;
}
