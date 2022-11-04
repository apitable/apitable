import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Any } from 'grpc/generated/google/protobuf/any';
import { Value } from 'grpc/generated/google/protobuf/struct';
import { SocketService } from 'grpc/generated/serving/SocketServingService';
import { lastValueFrom } from 'rxjs';
import { InjectLogger, SOCKET_GRPC_CLIENT } from 'shared/common';
import { IClientRoomChangeResult } from 'shared/services/socket/socket.interface';
import { Logger } from 'winston';

export class GrpcSocketClient implements OnModuleInit {
  private socketClient: SocketService;

  constructor(@Inject(SOCKET_GRPC_CLIENT) private readonly client: ClientGrpc, @InjectLogger() private readonly logger: Logger) {}

  onModuleInit(): any {
    this.socketClient = this.client.getService<SocketService>('SocketService');
  }

  /**
   * room change notification, only works for Fusion API
   * @param roomId
   * @param changesets
   */
  async nestRoomChange(roomId: string, changesets: IClientRoomChangeResult[]) {
    try {
      const data = Any.fromPartial({
        value: Value.encode(Value.wrap(changesets)).finish(),
      });
      await lastValueFrom(this.socketClient.serverRoomChange({ roomId, data }));
    } catch (e) {
      this.logger.error('Failed to notify room', { e });
    }
  }
}
