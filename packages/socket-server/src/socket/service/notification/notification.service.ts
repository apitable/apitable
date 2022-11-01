import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Socket } from 'socket.io';
import { GrpcClient } from 'src/grpc/client/grpc.client';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { NotificationTypes } from 'src/socket/enum/request-types.enum';
import { AuthenticatedSocket } from 'src/socket/interface/socket/authenticated-socket.interface';
import { NodeChangeRo } from 'src/socket/model/ro/notification/node-change.ro';
import { NotificationRo } from 'src/socket/model/ro/notification/notification.ro';
import { WatchSpaceRo } from 'src/socket/model/ro/notification/watch-space.ro';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly grpcClient: GrpcClient
  ) {
  }

  broadcastNotify(message: NotificationRo, client: Socket): boolean {
    if (isNil(message.toUserId)) {
      throw new ForbiddenException('Forbidden:403', 'User mismatch');
    }
    try {
      client.in(SocketConstants.USER_SOCKET_ROOM + message.toUserId).emit(message.event, message);
      this.logger.debug(message);
      return true;
    } catch (e) {
      this.logger.error('Error:broadcastNotify', e?.stack);
      return false;
    }
  }

  watchSpace(message: WatchSpaceRo, client: AuthenticatedSocket): boolean {
    try {
      client.join(this.getSpaceRoom(message.spaceId));
      return true;
    } catch (e) {
      this.logger.error('Error:watchSpace', e?.stack);
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
      this.logger.error('Error:nodeChange', e?.stack);
      return false;
    }
  }

  async nodeBrowsed(nodeId: string, uuid: string): Promise<boolean> {
    try {
      const result = await this.grpcClient.recordNodeBrowsing({ nodeId, uuid });
      return result.success;
    } catch (e) {
      this.logger.error('Error:nodeBrowsed', e?.stack);
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
