import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectLogger, SOCKET_GRPC_CLIENT } from '../../shared/common';
import { IClientRoomChangeResult } from 'shared/services/socket/socket.interface';
import { vika } from 'proto/generated/proto/changeset.service';
import { pack } from 'proto/util/pack.message';
import { Logger } from 'winston';

export class GrpcSocketClient implements OnModuleInit {
  private socketClient: vika.grpc.ChangesetService;

  constructor(@Inject(SOCKET_GRPC_CLIENT) private readonly client: ClientGrpc, @InjectLogger() private readonly logger: Logger) {
  }

  onModuleInit(): any {
    this.socketClient = this.client.getService<vika.grpc.ChangesetService>('ChangesetService');
  }

  /**
   * room change notification, only works for Fusion API
   * @param roomId
   * @param changesets
   */
  async nestRoomChange(roomId: string, changesets: IClientRoomChangeResult[]) {
    try {
      await this.socketClient.serverRoomChange({ roomId, data: pack(changesets, 'vika.grpc.ServerRoomChangeRo.data') }).toPromise();
    } catch(e) {
      this.logger.error('Failed to notify room', { e });
    }
  }
}
