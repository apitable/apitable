import { ForbiddenException, Injectable } from '@nestjs/common';
import { NotificationRo } from 'src/socket/model/ro/notification/notification.ro';
import { INotificationService } from './i-notification-service.interface';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { Socket } from 'socket.io';
import { logger } from 'src/socket/common/helper';
import { WatchSpaceRo } from 'src/socket/model/ro/notification/watch-space.ro';
import { AuthenticatedSocket } from 'src/socket/interface/socket/authenticated-socket.interface';
import { NodeChangeRo } from 'src/socket/model/ro/notification/node-change.ro';
import { NotificationTypes } from 'src/socket/enum/request-types.enum';
import { GatewayConstants } from 'src/socket/constants/gateway.constants';
import { GrpcClient } from 'src/grpc/client/grpc.client';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(private readonly grpcClient: GrpcClient) {
  }

  broadcastNotify(message: NotificationRo, client: Socket): boolean {
    if (isNil(message.toUserId)) {
      throw new ForbiddenException('Forbidden:403', '用户不匹配');
    }
    try {
      client.in(SocketConstants.USER_SOCKET_ROOM + message.toUserId).emit(message.event, message);
      logger('NotificationService:broadcastNotify').debug(message);
      return true;
    } catch (e) {
      logger('Error:broadcastNotify').error(e);
      return false;
    }
  }

  watchSpace(message: WatchSpaceRo, client: AuthenticatedSocket): boolean {
    try {
      client.join(this.getSpaceRoom(message.spaceId));
      return true;
    } catch (e) {
      logger('NotificationService:WatchSpace').error(e, e.message);
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
      logger('NotificationService:nodeChange').debug(message);
      return true;
    } catch (e) {
      logger('Error:nodeChangeNotify').error(e, e.message);
      return false;
    }
  }

  async nodeBrowsed(nodeId: string, uuid: string): Promise<boolean> {
    try {
      const result = await this.grpcClient.recordNodeBrowsing({ nodeId, uuid });
      return result.success;
    } catch (err) {
      logger('NotificationService').error('nodeBrowsed', err.stack);
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
