import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { GatewayConstants } from 'src/constants/gateway.constants';
import { pack, unpack } from 'src/grpc/util/pack.message.';
import { vika } from 'src/grpc/generated/grpc/proto/socket.service';
import { VikaGrpcClientProxy } from 'src/grpc/client/vika.grpc.client.proxy';
import { logger } from '../../common/helper';

@Injectable()
export class NestClient implements OnModuleInit {
  private nestService: vika.grpc.SocketService;

  constructor(@Inject(GatewayConstants.NEST_SERVICE) private readonly client: VikaGrpcClientProxy) {
  }

  async onModuleInit() {
    this.nestService = await this.client.getService<vika.grpc.SocketService>('SocketService');
  }

  async watchRoom(message: vika.grpc.WatchRoomRo, metadata: any): Promise<any | null> {
    logger(`C-TraceId[${metadata.get('X-C-TraceId')}] WatchRoom`).log(`socket-id:[${message.clientId}] To room-server:[${await this.client.currentClientUrl}]`);
    return await this.nestService.watchRoom(message, metadata).toPromise();
  }

  async getActiveCollaborators(message: vika.grpc.WatchRoomRo, metadata: any): Promise<any | null> {
    logger(`C-TraceId[${metadata.get('X-C-TraceId')}] GetActiveCollaborators`).log(`socket-id:[${message.clientId}] To room-server:[${await this.client.currentClientUrl}]`);
    return await this.nestService.getActiveCollaborators(message, metadata).toPromise();
  }

  async leaveRoom(message: vika.grpc.LeaveRoomRo, metadata: any): Promise<vika.grpc.BasicResult> {
    logger(`C-TraceId[${metadata.get('X-C-TraceId')}] LeaveRoom`).log(`socket-id:[${message.clientId}] To room-server:[${await this.client.currentClientUrl}]`);
    return await this.nestService.leaveRoom(message, metadata).toPromise();
  }

  async roomChange(message: vika.grpc.UserRoomChangeRo, metadata: any): Promise<any> {
    logger(`C-TraceId[${metadata.get('X-C-TraceId')}] RoomChange`).log(`socket-id:[${message.clientId}] To room-server:[${await this.client.currentClientUrl}]`);
    message.changesets = pack(message.changesets, 'socket.UserRoomChangeRo.changesets');
    const result = await this.nestService.roomChange(message, metadata).toPromise();
    if (result.data) {
      result.data = unpack(result.data);
    }
    return result;
  }

}
