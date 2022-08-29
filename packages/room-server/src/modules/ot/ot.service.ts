import { Injectable } from '@nestjs/common';
import {
  clearComputeCache, ConfigConstant, DEFAULT_EDITOR_PERMISSION, IJOTAction, ILocalChangeset, IRemoteChangeset, jot, ResourceIdPrefix, ResourceType
} from '@vikadata/core';
import { NodeTypeReg } from '@vikadata/core/dist/config/constant';
import { RedisService } from '@vikadata/nestjs-redis';
import { EnvConfigKey } from 'common';
import { InjectLogger } from 'common/decorators';
import { EnvConfigService } from 'config/env.config.service';
import { INodeCopyRo, INodeDeleteRo } from 'controllers/internal/grpc/grpc.interface';
import { SourceTypeEnum } from 'enums/changeset.source.type.enum';
import { OtException } from 'exception/ot.exception';
import { ServerException } from 'exception/server.exception';
import { RedisLock } from 'helpers/redis.lock';
import { IServerConfig } from 'interfaces';
import { IAuthHeader, NodePermission } from 'interfaces/axios.interfaces';
import { isNil } from 'lodash';
import { DashboardOtService } from 'modules/ot/dashboard.ot.service';
import { DatasheetOtService } from 'modules/ot/datasheet.ot.service';
import { MirrorOtService } from 'modules/ot/mirror.ot.service';
import { WidgetOtService } from 'modules/ot/widget.ot.service';
import { ResourceMetaRepository } from 'modules/repository/resource.meta.repository';
import { RestService } from 'modules/rest/rest.service';
import { DatasheetChangesetService } from 'modules/services/datasheet/datasheet.changeset.service';
import { DatasheetChangesetSourceService } from 'modules/services/datasheet/datasheet.changeset.source.service';
import { DatasheetRecordSubscriptionService } from 'modules/services/datasheet/datasheet.record.subscription.service';
import { DatasheetService } from 'modules/services/datasheet/datasheet.service';
import { EventService } from 'modules/services/event/event.service';
import { MirrorService } from 'modules/services/mirror/mirror.service';
import { NodePermissionService } from 'modules/services/node/node.permission.service';
import { NodeService } from 'modules/services/node/node.service';
import { NodeShareSettingService } from 'modules/services/node/node.share.setting.service';
import { ChangesetService } from 'modules/services/resource/changeset.service';
import { ResourceService } from 'modules/services/resource/resource.service';
import { UserService } from 'modules/services/user/user.service';
import { RoomResourceRelService } from 'modules/socket/room.resource.rel.service';
import { GrpcSocketClient } from 'proto/client/grpc.socket.client';
import { EntityManager, getManager } from 'typeorm';
import { promisify } from 'util';
import { Logger } from 'winston';
import { MetaService } from '../services/resource/meta.service';
import { FormOtService } from './form.ot.service';
import { EffectConstantName, IChangesetParseResult, ICommonData, IOtEventContext, IRoomChannelMessage, MAX_REVISION_DIFF } from './ot.interface';
import { ResourceChangeHandler } from './resource.change.handler';

/**
 * OT 处理服务类
 */
@Injectable()
export class OtService {

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly permissionServices: NodePermissionService,
    private readonly nodeShareSettingService: NodeShareSettingService,
    private readonly datasheetService: DatasheetService,
    private readonly datasheetChangesetService: DatasheetChangesetService,
    private readonly datasheetChangesetSourceService: DatasheetChangesetSourceService,
    private readonly datasheetRecordSubscriptionService: DatasheetRecordSubscriptionService,
    private readonly relService: RoomResourceRelService,
    private readonly grpcSocketClient: GrpcSocketClient,
    private readonly changesetService: ChangesetService,
    private readonly metaService: MetaService,
    private readonly mirrorService: MirrorService,
    private readonly redisService: RedisService,
    private readonly datasheetOtService: DatasheetOtService,
    private readonly widgetOtService: WidgetOtService,
    private readonly resourceService: ResourceService,
    private readonly resourceMetaRepository: ResourceMetaRepository,
    private readonly dashboardOtService: DashboardOtService,
    private readonly mirrorOtService: MirrorOtService,
    private readonly formOtService: FormOtService,
    private readonly resourceChangeHandler: ResourceChangeHandler,
    private readonly restService: RestService,
    private readonly envConfigService: EnvConfigService,
    private readonly eventService: EventService,
    private readonly nodeService: NodeService,
  ) { }

  /**
   * 获取操作用户对节点的权限
   * @param nodeId 这里的做了扩展，不仅限于 dstId，还会包括其它各种节点 Id
   * @param cookie 会话
   * @param token 令牌
   * @param needCheckShare
   */
  getNodeRole = async(nodeId: string, auth: IAuthHeader, shareId?: string,
    roomId?: string, sourceDatasheetId?: string, sourceType?: SourceTypeEnum, allowAllEntrance?: boolean): Promise<NodePermission> => {
    switch (sourceType) {
      case SourceTypeEnum.FORM:
        // 神奇表单提交产生的数表资源 OP，权限以神奇表单节点为准
        const fieldPermissionMap = await this.restService.getFieldPermission(auth, roomId!, shareId);
        const defaultPermission = { fieldPermissionMap, hasRole: true, role: ConfigConstant.permission.editor, ...DEFAULT_EDITOR_PERMISSION };
        const { fillAnonymous } = await this.resourceMetaRepository.selectMetaByResourceId(roomId!);
        // 分享模式下若允许匿名填写，直接返回默认权限
        if (shareId && Boolean(fillAnonymous)) {
          return defaultPermission;
        }
        // 补充用户信息
        const { userId, uuid } = await this.userService.getMe(auth);
        return { userId, uuid, ...defaultPermission };
      case SourceTypeEnum.MIRROR:
        if (nodeId !== sourceDatasheetId) {
          break;
        }
        const permission = await this.permissionServices.getNodeRole(roomId!, auth, shareId);
        // 改写 mirror 权限集
        this.mirrorService.rewriteMirrorPermission(permission);
        return permission;
      default:
        break;
    }
    // 获取节点权限信息。这里不做权限校验，交由资源解析操作时，校验具体要求权限
    const permission = await this.permissionServices.getNodeRole(nodeId, auth, shareId);
    // 可编辑或以上权限，不需要进行数据源入口的全范围加载
    if (permission.editable || !allowAllEntrance) {
      return permission;
    }
    // 获取该数表的关联节点资源（form、mirror...）
    const relNodeIds = await this.nodeService.getRelNodeIds(nodeId);
    if (relNodeIds?.length === 0) {
      return permission;
    }
    //TODO 批量处理加载多个镜像的节点权限集
    for (const relNodeId of relNodeIds) {
      if (!relNodeId.startsWith(ResourceIdPrefix.Mirror)) {
        continue;
      }
      const relNodePermission = await this.permissionServices.getNodeRole(relNodeId, auth, shareId);
      if (relNodePermission.editable) {
        // 改写 mirror 权限集
        this.mirrorService.rewriteMirrorPermission(relNodePermission);
        return relNodePermission;
      }
    }
    return permission;
  };

  /**
   * 应用 ROOM 变更集
   * @param message 客户端 ROOM 消息
   * @param cookie 浏览器cookie
   * @param token 用户访问令牌
   */
  async applyRoomChangeset(message: IRoomChannelMessage, auth: IAuthHeader): Promise<IRemoteChangeset[]> {
    // 校验分享是否开启可编辑
    if (message.shareId) {
      await this.nodeShareSettingService.checkNodeShareCanBeEdited(message.shareId, message.roomId);
    }
    const spaceId = await this.resourceService.getSpaceIdByResourceId(message.roomId);

    const msgIds = message.changesets.map(cs => cs.messageId);
    const client = this.redisService.getClient();
    const lock = promisify<string | string[], number, () => void>(RedisLock(client as any));
    // 对资源加锁，同一个资源的 message 只能依次进行消费。120秒超时
    const unlock = await lock(message.changesets.map(cs => cs.resourceId), 120 * 1000);
    const attachCites: any[] = [];
    const results: IRemoteChangeset[] = [];
    const context: IOtEventContext = { authHeader: auth, spaceId, fromEditableSharedNode: !isNil(message.shareId) };
    //!!! 警告，所有Service/网络相关操作必须放进 try 中，否则会导致死锁
    try {
      const beginTime = +new Date();
      this.logger.info(`room:[${message.roomId}] ====> parseChanges 开始......`);
      const transactions: IChangesetParseResult[] = [];
      for (const cs of message.changesets) {
        const { transaction, effectMap, commonData, resultSet } = await this.parseChanges(spaceId, message, cs, auth);
        if (!context.operatorUserId && commonData.userId) {
          context.operatorUserId = commonData.userId;
        }
        transactions.push({ transaction, effectMap, commonData, resultSet });
        attachCites.push(effectMap.get(EffectConstantName.AttachCite));
      }
      const parseEndTime = +new Date();
      this.logger.info(`room:[${message.roomId}] ====> parseChanges 结束，耗时: ${parseEndTime - beginTime}ms。总事务开始......`);
      // ======== 多资源操作事务 BEGIN ========
      this.logger.info('applyRoomChangeset-transaction-start', { msgIds });
      await getManager().transaction(async(manager: EntityManager) => {
        for (const { transaction, effectMap, commonData, resultSet } of transactions) {
          await transaction(manager, effectMap, commonData, resultSet);
          let remoteChangeset = effectMap.get(EffectConstantName.RemoteChangeset);
          if (!remoteChangeset.userId && commonData.userId) {
            remoteChangeset = { ...remoteChangeset, userId: commonData.userId };
          }
          results.push(remoteChangeset);
        }
      });
      const endTime = +new Date();
      this.logger.info(`room:[${message.roomId}] ====> 总事务结束，耗时: ${endTime - parseEndTime}ms`);
      this.logger.info('applyRoomChangeset-transaction-end', { msgIds });
      // 处理资源变更事件
      await this.resourceChangeHandler.handleResourceChange(message.roomId, transactions);
      // ======== 多资源操作事务 END ========
    } finally {
      // 释放各资源的锁
      await unlock();
    }

    // 在没有异常的情况下才进行附件计算，保证数据一致性(如果计算失败，会有定时任行务进补偿)
    // 加入队列，提交给java计算op中附件容，放量入队列是为了防止并发
    this.logger.info('applyRoomChangeset-handle-attach', { msgIds });
    if (attachCites.length) {
      for (const item of attachCites) {
        this.restService.calDstAttachCite(auth, item);
      }
    }

    const thisBatchResourceIds = results.reduce((ids, result) => {
      if (result.resourceType === ResourceType.Datasheet) {
        ids.push(result.resourceId);
      }
      return ids;
    }, [] as string[]);

    const allEffectDstIds: string[] = await this.relService.getEffectDatasheetIds(thisBatchResourceIds);
    const hasRobot = await this.resourceService.getHasRobotByResourceIds(allEffectDstIds);
    this.logger.info('applyRoomChangeset-hasRobot', { msgIds, thisBatchResourceIds, allEffectDstIds, hasRobot });
    if (hasRobot) {
      // 这里处理事件
      this.logger.info('applyRoomChangeset-robot-event-start', { msgIds });
      // 清缓存
      allEffectDstIds.forEach(resourceId => {
        clearComputeCache(resourceId);
      });
      this.eventService.handleChangesets(results);
    }

    // 用户订阅记录变更事件
    this.datasheetRecordSubscriptionService.handleChangesets(results, context);

    return results;
  }

  /**
   * 解析变更集
   * @param spaceId
   * @param mainResourceId
   * @param message 通道消息
   * @param cookie
   * @param token
   */
  async parseChanges(spaceId: string, message: IRoomChannelMessage, changeset: ILocalChangeset,
    auth: IAuthHeader): Promise<IChangesetParseResult> {
    const { sourceDatasheetId, sourceType, shareId, roomId, internalAuth, allowAllEntrance } = message;
    const { resourceId } = changeset;

    // 临时补充 resourceType
    if (changeset.resourceType == null) {
      switch (resourceId.substr(0, 3)) {
        case NodeTypeReg.DATASHEET: {
          changeset.resourceType = ResourceType.Datasheet;
          break;
        }
        case NodeTypeReg.DASHBOARD: {
          changeset.resourceType = ResourceType.Dashboard;
          break;
        }
        case NodeTypeReg.WIDGET: {
          changeset.resourceType = ResourceType.Widget;
          break;
        }
      }
    }

    const { resourceType } = changeset;

    // 如果不存在版本号，默认以数表最新的版本号进行填充
    if (changeset.baseRevision == null) {
      changeset.baseRevision = await this.changesetService.getMaxRevision(resourceId, resourceType);
    }

    // 检查资源消息是否重复
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`检查资源[${resourceId}]消息是否重复`);
    }
    const msgExist = await this.changesetService.countByResourceIdAndMessageId(resourceId, resourceType, changeset.messageId);
    if (msgExist) {
      // 重复消息，抛出异常
      throw new ServerException(OtException.MSG_ID_DUPLICATE);
    }
    // 查询资源版本号
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${resourceId}]获取数据库版本`);
    }
    const { resourceRevision, nodeId } = await this.metaService.getResourceInfo(resourceId, resourceType);
    if (resourceRevision === undefined || !nodeId) {
      this.logger.info(`REVISION_ERROR : ${resourceRevision}  --- ${nodeId} --- ${resourceId}`);
      throw new ServerException(OtException.REVISION_ERROR);
    }
    // 客户端提交的operations转换成正确的changeset
    const remoteChangeset = await this.transform(changeset, resourceRevision);
    // 获取变更集的最大版本号
    const changesetRevision = await this.changesetService.getMaxRevision(resourceId, resourceType);
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${resourceId}]原变更集最大版本号:${changesetRevision}`);
    }
    // 不存在则默认使用传输过来的版本号
    const rightRevision = changesetRevision ? changesetRevision + 1 : remoteChangeset.revision;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${resourceId}]原变更集版本号理论值:${rightRevision}`);
      this.logger.debug(`[${resourceId}]客户端的版本号理论值:${remoteChangeset.revision}`);
    }
    const isEqual = remoteChangeset.revision === rightRevision;
    // 不匹配的情况下，需要拒绝
    if (!isEqual) {
      throw new ServerException(OtException.MATCH_VERSION_ERROR);
    }
    // 获取权限，如果开启了可编辑，不查node/permission，直接设置permission是editor权限，同时还要拿到userId
    const permission = internalAuth
      ? { ...this.permissionServices.getDefaultManagerPermission(), userId: internalAuth.userId, uuid: internalAuth.uuid }
      : await this.getNodeRole(nodeId, auth, shareId, roomId, sourceDatasheetId, sourceType, allowAllEntrance);

    // 副作用变量收集器
    const effectMap = new Map<string, any>();
    effectMap.set(EffectConstantName.RemoteChangeset, remoteChangeset);
    // 需要通知的map
    effectMap.set(EffectConstantName.MentionedMessages, []);

    // 循环客户端提交的操作,注意, 可能存在多个operations, 但都是针对同一个资源的操作
    const beginTime = +new Date();
    this.logger.info(`[${resourceId}] ====> 遍历Meta Operations开始......`);
    let transaction;
    let resultSet;
    switch (resourceType) {
      case ResourceType.Datasheet: {
        resultSet = this.datasheetOtService.createResultSet();
        transaction = await this.datasheetOtService.analyseOperates(
          spaceId,
          sourceDatasheetId || roomId,
          remoteChangeset.operations,
          resourceId,
          permission,
          this.getNodeRole,
          effectMap,
          resultSet,
          auth,
          sourceType,
        );
        break;
      }
      case ResourceType.Widget: {
        resultSet = this.widgetOtService.createResultSet();
        transaction = await this.widgetOtService.analyseOperates(remoteChangeset.operations, permission, resultSet);
        break;
      }
      case ResourceType.Dashboard: {
        resultSet = this.dashboardOtService.createResultSet();
        transaction = await this.dashboardOtService.analyseOperates(remoteChangeset.operations, permission, resultSet);
        break;
      }
      case ResourceType.Mirror: {
        resultSet = this.mirrorOtService.createResultSet();
        transaction = await this.mirrorOtService.analyseOperates(remoteChangeset.operations, permission, resultSet);
        break;
      }
      case ResourceType.Form: {
        resultSet = this.formOtService.createResultSet();
        transaction = await this.formOtService.analyseOperates(remoteChangeset.operations, permission, resultSet);
        break;
      }
    }
    this.logger.info(`[${resourceId}] ====> 遍历Meta Operations结束......总耗时: ${+new Date() - beginTime}ms`);

    const commonData: ICommonData = {
      userId: permission.userId,
      uuid: permission.uuid,
      spaceId: spaceId,
      dstId: nodeId,
      revision: rightRevision,
      resourceId,
      resourceType,
      permission,
    };

    return { transaction, resultSet, effectMap, commonData };
  }

  /**
   * 转换
   * @param changeset  变更集
   * @param dbRevision 数据库保存变更集的版本号
   */
  private async transform(changeset: ILocalChangeset, dbRevision: number): Promise<IRemoteChangeset> {
    const { baseRevision, ...localChangeset } = changeset;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${changeset.resourceId}]数据库保存的版本:${dbRevision}`);
      this.logger.debug(`[${changeset.resourceId}]客户端提交的版本:${baseRevision}`);
    }
    const revisionDiff = dbRevision - baseRevision;
    // baseRevision 理论上不能大于 currentRevision
    if (revisionDiff < 0) {
      throw new ServerException(OtException.REVISION_CONFLICT);
    }

    // baseRevision 与服务端版本差距过大
    if (revisionDiff > MAX_REVISION_DIFF) {
      throw new ServerException(OtException.REVISION_OVER_LIMIT);
    }

    this.logger.info(`${changeset.resourceId}[${baseRevision}/${dbRevision}] operations length: ${JSON.stringify(changeset.operations).length}`);
    // baseRevision 和 currentRevision 不相等，则要进行 transform
    if (revisionDiff > 0) {
      // 生成 revision 差距的数组, 比如要获取 8~10 版本的 changeset 则生成[8, 9, 10]的参数数组
      const revisions = Array.from({ length: revisionDiff }).map((_, index) => baseRevision + index + 1);
      const changesets = await this.changesetService.getByRevisions(changeset.resourceId, changeset.resourceType, revisions);
      const isEqual = changesets && changesets.length === revisions.length;
      if (!isEqual) {
        this.logger.info(`REVISION_ERROR :${revisions.join(',')} --- ${changesets.map(item => item.revision).join(',')} --- ${changeset.resourceId}`);
        throw new ServerException(OtException.REVISION_ERROR);
      }
      let serverActions = changesets.reduce<IJOTAction[]>((pre, cs) => {
        cs.operations?.forEach(op => {
          pre.push(...op.actions);
        });
        return pre;
      }, []);
      let localActionLength = 0;
      changeset.operations.forEach(op => {
        localActionLength += op.actions.length;
      });
      // 数据库的版本过大，不在服务端进行transform，交由客户端进行比较之后再存入
      const serverConfig = this.envConfigService.getRoomConfig(EnvConfigKey.CONST) as IServerConfig;
      if (serverActions.length * localActionLength > serverConfig.transformLimit) {
        this.logger.error(`${changeset.resourceId}[action差异过大]${localActionLength}/${serverActions.length}`);
        throw new ServerException(OtException.REVISION_OVER_LIMIT);
      }
      // 交叉转换生成新的 operations
      // 原理请参考：https://ones.ai/wiki/#/team/NqxK6uTp/space/L8swSDkE/page/GjwDGTz1
      const newOperations = localChangeset.operations.map(op => {
        const [leftOp, rightOp] = jot.transformX(op.actions, serverActions);
        serverActions = rightOp;

        for (const v of leftOp) {
          // 这里是针对视图配置不协同的处理。前端保存视图配置，会将 columns 字段做整体的替换，这样处理对于 transform 非常不友好，
          // 所以当发现操作的是 columns ，并且 oi 和 od 的长度对不上时，中间层抛错
          if (
            v.p.includes('columns') &&
            v['oi'] &&
            v['od'] &&
            v['oi'].length !== v['od'].length
          ) {
            throw new ServerException(OtException.OPERATION_ABNORMAL);
          }
        }
        return {
          cmd: op.cmd,
          actions: leftOp,
          mainLinkDstId: op.mainLinkDstId,
        };
      });

      return { ...localChangeset, revision: dbRevision + 1, operations: newOperations };
    }

    return { ...localChangeset, revision: dbRevision + 1 };
  }

  /**
   * 空间站内复制节点
   *
   * @param data 复制节点的参数数据
   * @return boolean
   * @throws ServerException
   * @author Zoe Zheng
   * @date 2021/3/25 11:27 上午
   */
  async copyNodeEffectOt(data: INodeCopyRo): Promise<boolean> {
    const store = await this.datasheetService.fillBaseSnapshotStoreByDstIds([data.copyNodeId, data.nodeId]);
    const copyNodeChangesets = this.datasheetChangesetService.getCopyNodeChangesets(data, store);
    if (copyNodeChangesets) {
      const { error } = await this.applyDstChangeset({
        roomId: data.copyNodeId,
        internalAuth: { userId: data.userId, uuid: data.uuid },
        changesets: copyNodeChangesets,
        sourceType: SourceTypeEnum.RELATION_EFFECT,
      });
      if (error) {
        throw error;
      }
    }
    return true;
  }

  async deleteNodeEffectOt(data: INodeDeleteRo): Promise<boolean> {
    const store = await this.datasheetService.fillBaseSnapshotStoreByDstIds([...data.deleteNodeId, ...data.linkNodeId], false);
    const deleteNodeChangesets = this.datasheetChangesetService.getDeleteNodeChangesets(data, store);
    if (deleteNodeChangesets) {
      const { error } = await this.applyDstChangeset({
        roomId: deleteNodeChangesets[0].resourceId,
        internalAuth: { userId: data.userId, uuid: data.uuid },
        changesets: deleteNodeChangesets,
        sourceType: SourceTypeEnum.RELATION_EFFECT,
      });
      if (error) {
        throw error;
      }
    }
    return true;
  }

  async applyDstChangeset(
    message: IRoomChannelMessage,
    sourceType = SourceTypeEnum.RELATION_EFFECT,
  ): Promise<{ result?: IRemoteChangeset[]; error?: ServerException }> {
    try {
      const result = await this.applyRoomChangeset(message, { internal: true });
      await this.datasheetChangesetSourceService.batchCreateChangesetSource(result, sourceType);
      await this.nestRoomChange(message.roomId, result);
      return { result };
    } catch (error) {
      return { error };
    }
  }

  /**
   * 新变更内容
   * 专门为fusion api提供变更
   * @param roomId
   * @param changesets
   */
  public async nestRoomChange(roomId: string, changesets: IRemoteChangeset[]) {
    const data = await this.relService.getRoomChangeResult(roomId, changesets);
    await this.grpcSocketClient.nestRoomChange(roomId, data);
  }

  async applyChangesets(roomId: string, changesets: ILocalChangeset[], auth: IAuthHeader, shareId?: string) {
    const changeResult = await this.applyRoomChangeset({ allowAllEntrance: true, roomId, shareId, changesets }, auth);
    this.logger.info('Resource:ApplyChangeSet Success!');
    // 通知Socket服务广播
    await this.nestRoomChange(roomId, changeResult);
    this.logger.info('Resource:NotifyChangeSet Success!');
    return changeResult;
  }

}
