import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { VikaGrpcClientProxy } from 'src/grpc/client/vika.grpc.client.proxy';
import { vika } from 'src/grpc/generated/grpc/proto/socket.service';
import { pack, unpack } from 'src/grpc/util/pack.message';
import { GatewayConstants } from 'src/socket/constants/gateway.constants';

@Injectable()
export class NestClient implements OnModuleInit {
  private readonly logger = new Logger(NestClient.name);
  private nestService: vika.grpc.SocketService;

  constructor(
    @Inject(GatewayConstants.NEST_SERVICE) private readonly client: VikaGrpcClientProxy
  ) {
  }

  async onModuleInit() {
    this.nestService = await this.client.getService<vika.grpc.SocketService>('SocketService');
  }

  async watchRoom(message: vika.grpc.WatchRoomRo, metadata: any): Promise<any | null> {
    this.logger.log({
      action: 'WatchRoom',
      traceId: String(metadata.get('X-C-TraceId')),
      message: `WatchRoom socket-id:[${message.clientId}] To room-server:[${await this.client.currentClientUrl}]`
    });

    return await lastValueFrom(this.nestService.watchRoom(message, metadata));
  }

  async getActiveCollaborators(message: vika.grpc.WatchRoomRo, metadata: any): Promise<any | null> {
    this.logger.log({
      action: 'GetActiveCollaborators',
      traceId: String(metadata.get('X-C-TraceId')),
      message: `GetActiveCollaborators socket-id:[${message.clientId}] To room-server:[${await this.client.currentClientUrl}]`
    });

    return await lastValueFrom(this.nestService.getActiveCollaborators(message, metadata));
  }

  async leaveRoom(message: vika.grpc.LeaveRoomRo, metadata: any): Promise<vika.grpc.BasicResult> {
    this.logger.log({
      action: 'LeaveRoom',
      traceId: String(metadata.get('X-C-TraceId')),
      message: `LeaveRoom socket-id:[${message.clientId}] To room-server:[${await this.client.currentClientUrl}]`
    });

    return await lastValueFrom(this.nestService.leaveRoom(message, metadata));
  }

  async roomChange(message: vika.grpc.UserRoomChangeRo, metadata: any): Promise<any> {
    this.logger.log({
      action: 'RoomChange',
      traceId: String(metadata.get('X-C-TraceId')),
      message: `RoomChange socket-id:[${message.clientId}] To room-server:[${await this.client.currentClientUrl}]`
    });

    message.changesets = pack(message.changesets, 'socket.UserRoomChangeRo.changesets');
    const result = await lastValueFrom(this.nestService.roomChange(message, metadata));
    if (result.data) {
      result.data = unpack(result.data);
    }
    return result;
  }

}
