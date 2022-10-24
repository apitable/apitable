import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ResourceIdPrefix } from '@apitable/core';
import { InjectLogger } from 'common';
import { ILeaveRoomRo, INodeCopyRo, INodeDeleteRo } from 'controllers/internal/grpc/grpc.interface';
import { SourceTypeEnum } from 'enums/changeset.source.type.enum';
import { GrpcExceptionFilter } from 'filters/grpc.exception.filter';
import { ApiResponse } from 'model/api.response';
import { GrpcSocketService } from 'modules/grpc_service/grpc.socket.service';
import { IRoomChannelMessage } from 'modules/ot/ot.interface';
import { OtService } from 'modules/ot/ot.service';
import { NodeService } from 'modules/services/node/node.service';
import { vika } from 'proto/generated/proto/socket.message';
import { pack, unpack } from 'proto/util/pack.message';
import { Logger } from 'winston';
import { TracingHandlerInterceptor } from 'interceptor/sentry.handlers.interceptor';

/**
 * <p>
 * grpc 内部服务 必须定义在controller中
 * </p>
 * @author Zoe zheng
 * @date 2021/3/24 4:34 下午
 */
@UseFilters(new GrpcExceptionFilter())
@UseInterceptors(new TracingHandlerInterceptor())
@Controller('grpc')
export class GrpcController {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly otService: OtService,
    private readonly nodeService: NodeService,
    private readonly grpcSocketService: GrpcSocketService,
  ) {}

  @GrpcMethod('NodeService', 'CopyNodeEffectOt')
  async copyNodeEffectOt(data: INodeCopyRo): Promise<ApiResponse<boolean>> {
    try {
      const result = await this.otService.copyNodeEffectOt(data);
      return ApiResponse.success(result);
    } catch (error) {
      this.logger.error('复制节点异常', { stack: error?.stack, message: error?.message });
      throw new RpcException(error);
    }
  }

  @GrpcMethod('NodeService', 'DeleteNodeEffectOt')
  async deleteNodeEffectOt(data: INodeDeleteRo): Promise<ApiResponse<boolean>> {
    try {
      const result = await this.otService.deleteNodeEffectOt(data);
      return ApiResponse.success(result);
    } catch (error) {
      this.logger.error('删除节点异常', { stack: error?.stack, message: error?.message });
      throw new RpcException(error);
    }
  }

  @GrpcMethod('SocketService', 'WatchRoom')
  async watchRoom(data: vika.grpc.WatchRoomRo, metadata: any): Promise<vika.grpc.WatchRoomVo> {
    try {
      const result = await this.grpcSocketService.watchRoom(data as any, data.clientId || '', data.socketIds || [], metadata);
      return ApiResponse.success(result);
    } catch (error) {
      return this.grpcSocketService.errorCatch(error, data);
    }
  }

  @GrpcMethod('SocketService', 'GetActiveCollaborators')
  async getActiveCollaborators(data: vika.grpc.WatchRoomRo): Promise<vika.grpc.GetActiveCollaboratorsVo> {
    try {
      const result = await this.grpcSocketService.getActiveCollaborators(data as any, data.spaceId || '', data.socketIds || []);
      return ApiResponse.success(result);
    } catch (error) {
      return this.grpcSocketService.errorCatch(error, data);
    }
  }

  @GrpcMethod('SocketService', 'LeaveRoom')
  async leaveRoom(data: ILeaveRoomRo): Promise<ApiResponse<boolean>> {
    try {
      const result = await this.grpcSocketService.leaveRoom(data.clientId);
      if (result) {
        return ApiResponse.success(true);
      }
      return ApiResponse.success(false);
    } catch (error) {
      this.logger.error('leaveRoom', { stack: error?.stack, message: error?.message });
      throw new RpcException(error);
    }
  }

  @GrpcMethod('SocketService', 'RoomChange')
  async userRoomChange(message: vika.grpc.UserRoomChangeRo): Promise<vika.grpc.UserRoomChangeVo> {
    try {
      let data: IRoomChannelMessage = {
        shareId: message.shareId,
        roomId: message.roomId || '',
        changesets: unpack(message.changesets),
      };
      if (message.roomId?.startsWith(ResourceIdPrefix.Mirror)) {
        const sourceDatasheetId = await this.nodeService.getMainNodeId(message.roomId);
        data = { sourceDatasheetId, sourceType: SourceTypeEnum.MIRROR, ...data };
      }
      const result = await this.grpcSocketService.roomChange(data, { cookie: message.cookie });
      return ApiResponse.success(pack(result, 'socket.UserRoomChangeVo.data'));
    } catch (error) {
      return this.grpcSocketService.errorCatch(error, message);
    }
  }
}
