import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcExceptionFilter } from 'src/socket/filter/grpc.exception.filter';
import { RoomGateway } from 'src/socket/gateway/room.gateway';
import { RoomService } from 'src/socket/service/room/room.service';
import { unpack } from 'src/grpc/util/pack.message';
import { vika } from 'src/grpc/generated/grpc/proto/changeset.service';

/**
 * <p>
 * grpc 内部服务 必须定义在controller中
 * </p>
 * @author Zoe zheng
 * @date 2021/3/24 4:34 下午
 */
@UseFilters(new GrpcExceptionFilter())
@Controller('socket')
export class SocketGrpcController {
  constructor(private readonly roomGateway: RoomGateway, private readonly roomService: RoomService) {}

  @GrpcMethod('ChangesetService', 'ServerRoomChange')
  serverRoomChange(message: vika.grpc.ServerRoomChangeRo): vika.grpc.BasicResult {
    this.roomService.broadcastServerChange(message.roomId, unpack(message.data), this.roomGateway.server);
    return {
      success: true,
      message: 'true',
      code: 200,
    };
  }
}
