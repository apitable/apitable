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

import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { SocketConstants } from 'shared/common/constants/socket.module.constants';
import { NotificationTypes } from 'shared/enums/request-types.enum';
import { Socket } from 'socket.io';
import { GrpcClient } from 'socket/grpc/client/grpc.client';
import { AuthenticatedSocket } from 'socket/interface/socket/authenticated-socket.interface';
import { NodeChangeRo } from 'socket/ros/notification/node-change.ro';
import { NotificationRo } from 'socket/ros/notification/notification.ro';
import { WatchSpaceRo } from 'socket/ros/notification/watch-space.ro';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly grpcClient: GrpcClient) {}

  broadcastNotify(message: NotificationRo, client: Socket): boolean {
    if (isNil(message.toUserId)) {
      throw new ForbiddenException('Forbidden:403', 'User mismatch');
    }
    try {
      client.in(SocketConstants.USER_SOCKET_ROOM + message.toUserId).emit(message.event, message);
      this.logger.debug(message);
      return true;
    } catch (e) {
      this.logger.error('Error:broadcastNotify', (e as Error)?.stack);
      return false;
    }
  }

  async watchSpace(message: WatchSpaceRo, client: AuthenticatedSocket): Promise<boolean> {
    try {
      await client.join(this.getSpaceRoom(message.spaceId));
      return true;
    } catch (e) {
      this.logger.error('Error:watchSpace', (e as Error)?.stack);
      return false;
    }
  }

  nodeChange(message: NodeChangeRo, client: AuthenticatedSocket): boolean {
    try {
      let room = this.getSpaceRoom(message.spaceId);
      if (message.uuid) {
        room = this.getUserRoom(message.uuid);
      }
      client.to(room).emit(NotificationTypes.NODE_CHANGE, message);
      this.logger.debug(message);
      return true;
    } catch (e) {
      this.logger.error('Error:nodeChange', (e as Error)?.stack);
      return false;
    }
  }

  async nodeBrowsed(nodeId: string, uuid: string): Promise<boolean> {
    try {
      const result = await this.grpcClient.recordNodeBrowsing({ nodeId, uuid });
      return result.success;
    } catch (e) {
      this.logger.error('Error:nodeBrowsed', (e as Error)?.stack);
      return false;
    }
  }

  private getSpaceRoom(spaceId: string): string {
    return SocketConstants.SPACE_ROOM_PREFIX + spaceId;
  }

  private getUserRoom(uuid: string): string {
    return SocketConstants.USER_SOCKET_ROOM + uuid;
  }
}
