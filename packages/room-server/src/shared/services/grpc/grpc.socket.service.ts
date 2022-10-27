import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { ICollaborator, OtErrorCode } from '@apitable/core';
import { RedisService } from '@vikadata/nestjs-redis';
import { APPLICATION_NAME, CommonStatusMsg, InjectLogger, VIKA_NEST_CHANNEL } from '../../common';
import { PermissionException, ServerException } from '../../exception';
import { getIPAddress } from 'shared/helpers/system.helper';
import { IAuthHeader } from '../../interfaces';
import { ApiResponse } from '../../../fusion/vos/api.response';
import { IRoomChannelMessage } from 'database/services/ot/ot.interface';
import { OtService } from 'database/services/ot/ot.service';
import { NodeService } from 'database/services/node/node.service';
import { NodeShareSettingService } from 'database/services/node/node.share.setting.service';
import { ResourceService } from 'database/services/resource/resource.service';
import { UserService } from 'database/services/user/user.service';
import { ClientStorage } from 'shared/services/socket/client.storage';
import { RoomResourceRelService } from 'shared/services/socket/room.resource.rel.service';
import { IClientRoomChangeResult, IWatchRoomMessage } from 'shared/services/socket/socket.interface';
import { Logger } from 'winston';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 *
 * Socket客户端服务
 * 服务启动完成后自动初始化并监听socket事件
 * 实现OnApplicationBootstrap接口，应用启动完成后即可自定义初始化操作
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
  ) {}

  /**
   * 这里采用pub/sub机制保证ip注册的实时性
   * 并且由socket统一维护redis
   * 注册失败不会启动项目
   *
   * APPLICATION_NAME = ROOM_SERVER，才会触发注册机制
   */
  async onApplicationBootstrap() {
    if ('ROOM_SERVER' === APPLICATION_NAME) {
      let published = false;
      // 失败最大重试10次
      let maxTimes = 0;
      do {
        try {
          const number = await this.publishIp(1);
          if (!number) {
            published = false;
          } else {
            published = true;
          }
        } catch (error) {
          published = false;
        }
        maxTimes++;
      } while (!published && maxTimes < 10);
      // todo 考虑最大重试次数之后是否通知开发者注册失败
    }
  }

  async onApplicationShutdown(signal?: string): Promise<any> {
    if ('ROOM_SERVER' === APPLICATION_NAME) {
      let published = false;
      // 失败最大重试10次
      let maxTimes = 0;
      do {
        try {
          const number = await this.publishIp(0);
          if (!number) {
            published = false;
          } else {
            published = true;
          }
        } catch (error) {
          published = false;
        }
        maxTimes++;
      } while (!published && maxTimes < 10);
      // todo 考虑最大重试次数之后是否通知开发者踢出失败
    }
    return Promise.resolve(signal);
  }

  public errorCatch(e, message): any {
    // 可能是OtException，或者是其他异常
    const statusCode = e instanceof ServerException ? e.getCode() : OtErrorCode.SERVER_ERROR;
    const errMsg = e instanceof ServerException ? e.getMessage() : CommonStatusMsg.DEFAULT_ERROR_MESSAGE;
    this.logger.error('处理数据变更异常 ', { stack: e?.stack || errMsg, code: e?.code || statusCode });
    if (!(e instanceof ServerException)) {
      // 过滤出不需要上报的异常
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

  private async watchRoomLogger<T>(traceId: string, func: string, promise: Promise<T>) {
    return await this.timeLogger(`C-TraceId[${traceId}] WATCH_ROOM`, func, promise);
  }

  /**
   * 将用户加入协同空间
   * @param message 用户消息
   * @param clientId 客户端ID
   * @param socketIds socket连接id集合
   * @param metadata grpc metadata
   */
  public async watchRoom(message: IWatchRoomMessage, clientId: string, socketIds: string[], metadata: any) {
    const createTime = Date.now();
    let userId;
    let collaborator;
    let spaceId;
    const cTraceId = metadata.get('X-C-TraceId')[0];
    this.logger.info(`C-TraceId[${cTraceId}] Watch Room: ${message.roomId}, ShareId: ${message.shareId} | ClientId: ${clientId}`);
    const nodeId = await this.watchRoomLogger(cTraceId, 'getNodeIdByResourceId', this.resourceService.getNodeIdByResourceId(message.roomId));
    if (!nodeId) {
      throw new ServerException(PermissionException.NODE_NOT_EXIST);
    }
    // 拒绝模板节点 watch
    const isTemplate = await this.watchRoomLogger(cTraceId, 'isTemplate', this.nodeService.isTemplate(nodeId));
    if (isTemplate) {
      throw new ServerException(PermissionException.ACCESS_DENIED);
    }
    if (message.shareId) {
      // 分享连接鉴权
      await this.watchRoomLogger(cTraceId, 'checkNodeHasOpenShare', this.nodeShareSettingService.checkNodeHasOpenShare(message.shareId, nodeId));
      const { uuid } = await this.watchRoomLogger(cTraceId, 'getMeNullable', this.userService.getMeNullable(message.cookie || ''));
      userId = uuid;
    } else {
      // 站内连接鉴权
      const user = await this.watchRoomLogger(cTraceId, 'getMe', this.userService.getMe({ cookie: message.cookie }));
      // 检查当前用户是否在该空间
      await this.watchRoomLogger(cTraceId, 'checkUserForNode', this.nodeService.checkUserForNode(user.userId, nodeId));
      // 校验节点权限
      await this.watchRoomLogger(cTraceId, 'checkNodePermission', this.nodeService.checkNodePermission(nodeId, { cookie: message.cookie }));
      userId = user.uuid;
    }
    // 存储当前用户信息
    await this.watchRoomLogger(cTraceId, 'set', this.clientStorage.set(
      clientId,
      { userId, socketId: clientId, createTime, shareId: message.shareId }
    ));
    // 获取当前房间的协同用户列表，根据加入时间排序
    const collaborators = (await this.watchRoomLogger(cTraceId, 'mget', this.clientStorage.mget<ICollaborator>(socketIds))).filter(Boolean).sort();
    // 过滤未登录用户
    const roomUserIds = collaborators.map(collaborator => collaborator.userId).filter(Boolean);
    if (roomUserIds.length) {
      spaceId = await this.watchRoomLogger(cTraceId, 'getSpaceIdByNodeId', this.nodeService.getSpaceIdByNodeId(nodeId));
      const userInfos = await this.watchRoomLogger(cTraceId, 'getUserInfo', this.userService.getUserInfo(spaceId, (roomUserIds as string[])));
      // 补充已登录用户的信息
      collaborators
        .filter(collaborator => collaborator.userId)
        .forEach(collaborator => {
          const user = userInfos.find(user => collaborator.userId === user.userId);
          if (!user) {
            return;
          }
          collaborator.avatar = user.avatar;
          collaborator.userName = user.name;
          collaborator.memberName = 'unitId' in user ? user!.name : ''; // 站内成员才有 unitId，name 表示成员昵称，站外人员留空成员昵称
        });
      // 当前用户信息
      if (userId) {
        collaborator = collaborators.find(collaborator => collaborator.userId === userId);
      }
    }
    // 获取 ROOM 内各个资源最新的版本号
    const resourceRevisions = await this.watchRoomLogger(cTraceId, 'getResourceRevisions', this.relService.getResourceRevisions(message.roomId));
    const endTime = +new Date();
    this.logger.info(
      `C-TraceId[${cTraceId}] Watch Room: ${message.roomId} Success，总耗时: ${endTime - createTime}ms | uuid: ${userId} | SocketIds: ${socketIds}`);
    return { resourceRevisions, collaborators, collaborator, spaceId };
  }

  /**
   * @description 作为 watchRoom 的辅助函数，支持跨 pod 获取当前房间内所有活跃用户的信息，
   * @param {IWatchRoomMessage} message
   * @param {string} spaceId
   * @param {string[]} socketIds
   * @returns {Promise<{collaborators: ICollaborator[]}>}
   */
  async getActiveCollaborators(message: IWatchRoomMessage, spaceId: string, socketIds: string[]) {
    if (!spaceId) {
      throw new ServerException(PermissionException.NODE_NOT_EXIST);
    }

    // 获取当前房间的协同用户列表，根据加入时间排序
    const collaborators = (await this.clientStorage.mget<ICollaborator>(socketIds)).filter(Boolean).sort();
    // 过滤未登录用户
    const roomUserIds = collaborators.map(collaborator => collaborator.userId).filter(Boolean);
    if (roomUserIds.length) {
      const userInfos = await this.userService.getUserInfo(spaceId, (roomUserIds as string[]));
      // 补充已登录用户的信息
      collaborators
        .filter(collaborator => collaborator.userId)
        .forEach(collaborator => {
          const user = userInfos.find(user => collaborator.userId === user.userId);
          if (!user) {
            return;
          }
          collaborator.avatar = user.avatar;
          collaborator.userName = user.name;
          collaborator.memberName = 'unitId' in user ? user!.name : ''; // 站内成员才有 unitId，name 表示成员昵称，站外人员留空成员昵称
        });
    }
    return { collaborators };
  }

  private async roomChangeLogger<T>(func: string, promise: Promise<T>) {
    return await this.timeLogger('CLIENT_ROOM_CHANGE', func, promise);
  }

  /**
   * 用户更改 ROOM 内的节点内容
   * @param message 消息数组
   */
  public async roomChange(message: IRoomChannelMessage, auth: IAuthHeader): Promise<IClientRoomChangeResult[]> {
    this.logger.info(
      `开始处理 CLIENT_ROOM_CHANGE,room:[${message.roomId}],shareId: ${message.shareId},changesets length:[${message.changesets.length}]`,
    );
    const beginTime = +new Date();
    const changesets = await this.roomChangeLogger('applyRoomChangeset', this.otService.applyRoomChangeset(message, auth));
    const data = await this.roomChangeLogger('getRoomChangeResult', this.relService.getRoomChangeResult(message.roomId, changesets));
    const endTime = +new Date();
    this.logger.info(`room:[${message.roomId}] CLIENT_ROOM_CHANGE 处理完成，总耗时: ${endTime - beginTime}ms`);
    // 返回响应数据
    return data;
  }

  /**
   * 用户离开数表协同空间
   * @param clientId 客户端ID
   */
  public leaveRoom(clientId: string) {
    return this.clientStorage.del(clientId);
  }

  async publishIp(action: number): Promise<number> {
    const message = JSON.stringify({ ip: getIPAddress(), action });
    try {
      // 保证redis连接的稳定性
      const redis = this.redisService.getClient().duplicate();
      const number = await redis.publish(VIKA_NEST_CHANNEL, message);
      if (!number) {
        this.logger.error('socket服务没有启动', { message, channel: VIKA_NEST_CHANNEL });
      } else {
        this.logger.info('发布IP成功', { message, channel: VIKA_NEST_CHANNEL });
      }
      // 手动删除连接
      redis.disconnect();
      return number;
    } catch (e) {
      this.logger.info('发布IP失败', { e: e.message, stack: e.stack, message });
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
