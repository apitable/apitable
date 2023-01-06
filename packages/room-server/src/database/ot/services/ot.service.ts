/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
  clearCachedSelectors,
  clearComputeCache,
  ConfigConstant,
  DEFAULT_EDITOR_PERMISSION,
  IJOTAction,
  ILocalChangeset,
  IRemoteChangeset,
  jot,
  ResourceIdPrefix,
  ResourceType,
} from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@apitable/nestjs-redis';
import { DatasheetChangesetService } from 'database/datasheet/services/datasheet.changeset.service';
import { DatasheetChangesetSourceService } from 'database/datasheet/services/datasheet.changeset.source.service';
import { DatasheetRecordSubscriptionBaseService } from 'database/subscription/datasheet.record.subscription.base.service';
import { DatasheetService } from 'database/datasheet/services/datasheet.service';
import { MirrorService } from 'database/mirror/services/mirror.service';
import { NodePermissionService } from 'node/services/node.permission.service';
import { NodeService } from 'node/services/node.service';
import { NodeShareSettingService } from 'node/services/node.share.setting.service';
import { DashboardOtService } from 'database/ot/services/dashboard.ot.service';
import { DatasheetOtService } from 'database/ot/services/datasheet.ot.service';
import { MirrorOtService } from 'database/ot/services/mirror.ot.service';
import { WidgetOtService } from 'database/ot/services/widget.ot.service';
import { ChangesetService } from 'database/resource/services/changeset.service';
import { ResourceService } from 'database/resource/services/resource.service';
import { UserService } from 'user/services/user.service';
import { GrpcSocketClient } from 'grpc/client/grpc.socket.client';
import { isNil } from 'lodash';
import { EnvConfigKey } from 'shared/common';
import { InjectLogger } from 'shared/common/decorators';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { OtException, ServerException } from 'shared/exception';
import { RedisLock } from 'shared/helpers/redis.lock';
import { IServerConfig } from 'shared/interfaces';
import { IAuthHeader, NodePermission } from 'shared/interfaces/axios.interfaces';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { RestService } from 'shared/services/rest/rest.service';
import { RoomResourceRelService } from 'database/resource/services/room.resource.rel.service';
import { EntityManager, getManager } from 'typeorm';
import { promisify } from 'util';
import { Logger } from 'winston';
import { INodeCopyRo, INodeDeleteRo } from '../../interfaces/grpc.interface';
import { ResourceMetaRepository } from 'database/resource/repositories/resource.meta.repository';
import { MetaService } from 'database/resource/services/meta.service';
import { FormOtService } from './form.ot.service';
import { EffectConstantName, IChangesetParseResult, 
  ICommonData, IOtEventContext, IRoomChannelMessage, MAX_REVISION_DIFF } from '../interfaces/ot.interface';
import { ResourceChangeHandler } from './resource.change.handler';
import { RobotEventService } from 'database/robot/services/robot.event.service';

/**
 * OT management service
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
    private readonly datasheetRecordSubscriptionService: DatasheetRecordSubscriptionBaseService,
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
    private readonly eventService: RobotEventService,
    private readonly nodeService: NodeService,
  ) {}

  /**
   * Obtain the node rule of the operator.
   *
   * @param nodeId node ID.
   */
  getNodeRole = async(
    nodeId: string,
    auth: IAuthHeader,
    shareId?: string,
    roomId?: string,
    sourceDatasheetId?: string,
    sourceType?: SourceTypeEnum,
    allowAllEntrance?: boolean,
  ): Promise<NodePermission> => {
    switch (sourceType) {
      case SourceTypeEnum.FORM:
        // Datasheet resource OP resulted from form submitting, use permission of form
        const fieldPermissionMap = await this.restService.getFieldPermission(auth, roomId!, shareId);
        const defaultPermission = { fieldPermissionMap, hasRole: true, role: ConfigConstant.permission.editor, ...DEFAULT_EDITOR_PERMISSION };
        const { fillAnonymous } = await this.resourceMetaRepository.selectMetaByResourceId(roomId!);
        // If anonymous filling is allowed in sharing mode, return default permission
        if (shareId && Boolean(fillAnonymous)) {
          return defaultPermission;
        }
        // Fill in user info
        const { userId, uuid } = await this.userService.getMe(auth);
        return { userId, uuid, ...defaultPermission };
      case SourceTypeEnum.MIRROR:
        if (nodeId !== sourceDatasheetId) {
          break;
        }
        const permission = await this.permissionServices.getNodeRole(roomId!, auth, shareId);
        // rewrite mirror permission set
        this.mirrorService.rewriteMirrorPermission(permission);
        return permission;
      default:
        break;
    }
    // Obtain node info. No authorization here, leave it to resource analysis operation
    const permission = await this.permissionServices.getNodeRole(nodeId, auth, shareId);
    // Editable or above permission, no need to do full-scale loading of data source entrance
    if (permission.editable || !allowAllEntrance) {
      return permission;
    }
    // Obtain related node resource (form, mirror, etc) of the datasheet
    const relNodeIds = await this.nodeService.getRelNodeIds(nodeId);
    if (relNodeIds?.length === 0) {
      return permission;
    }
    // TODO Batch loading node permission sets of multiple mirrors
    for (const relNodeId of relNodeIds) {
      if (!relNodeId.startsWith(ResourceIdPrefix.Mirror)) {
        continue;
      }
      const relNodePermission = await this.permissionServices.getNodeRole(relNodeId, auth, shareId);
      if (relNodePermission.editable) {
        // Rewrite mirror permission set
        this.mirrorService.rewriteMirrorPermission(relNodePermission);
        return relNodePermission;
      }
    }
    return permission;
  };

  /**
   * @param message client ROOM message
   */
  async applyRoomChangeset(message: IRoomChannelMessage, auth: IAuthHeader): Promise<IRemoteChangeset[]> {
    // Validate that sharing enables editing
    if (message.shareId) {
      await this.nodeShareSettingService.checkNodeShareCanBeEdited(message.shareId, message.roomId);
    }
    const spaceId = await this.resourceService.getSpaceIdByResourceId(message.roomId);

    const msgIds = message.changesets.map(cs => cs.messageId);
    const client = this.redisService.getClient();
    const lock = promisify<string | string[], number, () => void>(RedisLock(client as any));
    // Lock resource, messages of the same resource are consumed sequentially. Timeout is 120s
    const unlock = await lock(
      message.changesets.map(cs => cs.resourceId),
      120 * 1000,
    );
    const attachCites: any[] = [];
    const results: IRemoteChangeset[] = [];
    const context: IOtEventContext = {
      authHeader: auth,
      spaceId,
      fromEditableSharedNode: !isNil(message.shareId),
    };
    //!!! WARN All services and network related operations must be put inside try blocks, or dead lock may happen.
    try {
      const beginTime = +new Date();
      this.logger.info(`room:[${message.roomId}] ====> parseChanges Start......`);
      const transactions: IChangesetParseResult[] = [];
      for (const cs of message.changesets) {
        const { transaction, effectMap, commonData, resultSet } = await this.parseChanges(spaceId, message, cs, auth);
        if (!context.operatorUserId && commonData.userId) {
          context.operatorUserId = commonData.userId;
        }
        transactions.push({
          transaction,
          effectMap,
          commonData,
          resultSet,
        });
        attachCites.push(effectMap.get(EffectConstantName.AttachCite));
      }
      const parseEndTime = +new Date();
      this.logger.info(
        `room:[${message.roomId}] ====> parseChanges Finished, duration: ${parseEndTime - beginTime}ms. General transaction start......`,
      );
      // ======== multiple-resource operation transaction BEGIN ========
      this.logger.info('applyRoomChangeset-transaction-start', { msgIds });
      await getManager().transaction(async(manager: EntityManager) => {
        for (const { transaction, effectMap, commonData, resultSet } of transactions) {
          await transaction(manager, effectMap, commonData, resultSet);
          let remoteChangeset = effectMap.get(EffectConstantName.RemoteChangeset);
          if (!remoteChangeset.userId && commonData.userId) {
            remoteChangeset = {
              ...remoteChangeset,
              userId: commonData.userId,
            };
          }
          results.push(remoteChangeset);
        }
      });
      const endTime = +new Date();
      this.logger.info(`room:[${message.roomId}] ====> General transaction finished, duration: ${endTime - parseEndTime}ms`);
      this.logger.info('applyRoomChangeset-transaction-end', { msgIds });
      // Process resource change event
      await this.resourceChangeHandler.handleResourceChange(message.roomId, transactions);
      // ======== multiple-resource operation transaction END ========
    } finally {
      // Release lock of each resource
      await unlock();
    }

    // Only perform attachment computation if no exception was thrown, to ensure
    // data consistency. (If computation fails, cron job will compensate)
    // Add to queue, submit to java to calculate attachment capacity in op,
    // add to queue individually to avoid concurrency
    this.logger.info('applyRoomChangeset-handle-attach', { roomId: message.roomId, msgIds });
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
    this.logger.info('applyRoomChangeset-hasRobot', {
      roomId: message.roomId,
      msgIds,
      thisBatchResourceIds,
      allEffectDstIds,
      hasRobot,
    });
    if (hasRobot) {
      // Handle event here
      this.logger.info('applyRoomChangeset-robot-event-start', { roomId: message.roomId, msgIds });
      // Clear cache
      allEffectDstIds.forEach(resourceId => {
        clearComputeCache(resourceId);
      });
      this.eventService.handleChangesets(results);
      this.logger.info('applyRoomChangeset-robot-event-end', { roomId: message.roomId, msgIds });
    }

    // User subscription record change event
    this.datasheetRecordSubscriptionService.handleChangesets(results, context);

    // clear cached selectors, will remove after release/1.0.0
    clearCachedSelectors();

    return results;
  }

  async parseChanges(spaceId: string, message: IRoomChannelMessage, changeset: ILocalChangeset, auth: IAuthHeader): Promise<IChangesetParseResult> {
    const { sourceDatasheetId, sourceType, shareId, roomId, internalAuth, allowAllEntrance } = message;
    const { resourceId } = changeset;

    // Fill in resourceType if it is null
    if (changeset.resourceType == null) {
      switch (resourceId.substr(0, 3)) {
        case ConfigConstant.NodeTypeReg.DATASHEET: {
          changeset.resourceType = ResourceType.Datasheet;
          break;
        }
        case ConfigConstant.NodeTypeReg.DASHBOARD: {
          changeset.resourceType = ResourceType.Dashboard;
          break;
        }
        case ConfigConstant.NodeTypeReg.WIDGET: {
          changeset.resourceType = ResourceType.Widget;
          break;
        }
      }
    }

    const { resourceType } = changeset;

    // If no revision exists, default to latest revision of the datasheet
    if (changeset.baseRevision == null) {
      changeset.baseRevision = (await this.changesetService.getMaxRevision(resourceId, resourceType))!;
    }

    // Check if resource message is duplicate
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`Check if resource [${resourceId}] message is duplicate`);
    }
    const msgExist = await this.changesetService.countByResourceIdAndMessageId(resourceId, resourceType, changeset.messageId);
    if (msgExist) {
      // Duplicate message, throw an exception
      throw new ServerException(OtException.MSG_ID_DUPLICATE);
    }
    // Query resource revision
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${resourceId}] Obtain revision from database`);
    }
    const { resourceRevision, nodeId } = await this.metaService.getResourceInfo(resourceId, resourceType);
    if (resourceRevision === undefined || !nodeId) {
      this.logger.info(`REVISION_ERROR : ${resourceRevision}  --- ${nodeId} --- ${resourceId}`);
      throw new ServerException(OtException.REVISION_ERROR);
    }
    // Transform operations submitted by client into correct changeset
    const remoteChangeset = await this.transform(changeset, resourceRevision);
    // Obtain max revision of changesets
    const changesetRevision = await this.changesetService.getMaxRevision(resourceId, resourceType);
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${resourceId}] original max revision of changesets:${changesetRevision}`);
    }
    // If no max revision exists, use the revision from client
    const rightRevision = changesetRevision ? changesetRevision + 1 : remoteChangeset.revision;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${resourceId}] Theoretical value of original revision of changesets:${rightRevision}`);
      this.logger.debug(`[${resourceId}] Theoretical value of client revision:${remoteChangeset.revision}`);
    }
    const isEqual = remoteChangeset.revision === rightRevision;
    // Reject the revision if the revisions are not equal
    if (!isEqual) {
      throw new ServerException(OtException.MATCH_VERSION_ERROR);
    }
    // Obtain permission, if editable is enabled, don't query node/permission, set permission to editor direcly,
    // and obtain userId
    const permission = internalAuth
      ? { ...this.permissionServices.getDefaultManagerPermission(), userId: internalAuth.userId, uuid: internalAuth.uuid }
      : await this.getNodeRole(nodeId, auth, shareId, roomId, sourceDatasheetId, sourceType, allowAllEntrance);

    // Effect variable collector
    const effectMap = new Map<string, any>();
    effectMap.set(EffectConstantName.RemoteChangeset, remoteChangeset);
    // Map that needs notification
    effectMap.set(EffectConstantName.MentionedMessages, []);

    // Traverse operations from client, there may be multiple operations, but applied on the same resource.
    const beginTime = +new Date();
    this.logger.info(`[${resourceId}] ====> Start Meta Operations traversal......`);
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
    this.logger.info(`[${resourceId}] ====> Finished Meta Operations traversal......duration: ${+new Date() - beginTime}ms`);

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
   * @param dbRevision revision of changesets in database
   */
  private async transform(changeset: ILocalChangeset, dbRevision: number): Promise<IRemoteChangeset> {
    const { baseRevision, ...localChangeset } = changeset;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${changeset.resourceId}] revision in database:${dbRevision}`);
      this.logger.debug(`[${changeset.resourceId}] revision from client:${baseRevision}`);
    }
    const revisionDiff = dbRevision - baseRevision;
    // baseRevision is not greater than currentRevision theoretically
    if (revisionDiff < 0) {
      throw new ServerException(OtException.REVISION_CONFLICT);
    }

    // Difference of baseRevision and server revision is too large
    if (revisionDiff > MAX_REVISION_DIFF) {
      throw new ServerException(OtException.REVISION_OVER_LIMIT);
    }

    this.logger.info(`${changeset.resourceId}[${baseRevision}/${dbRevision}] operations length: ${JSON.stringify(changeset.operations).length}`);
    // baseRevision is not equal to currentRevision, needs transform
    if (revisionDiff > 0) {
      // Generate revision diff array, for example, if changesets of revisions 8~10 will be fetched, generate [8,9,10]
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
      // Revision in database is too large, do not transform in server, hand to client
      // to compare and then store
      const serverConfig = this.envConfigService.getRoomConfig(EnvConfigKey.CONST) as IServerConfig;
      if (serverActions.length * localActionLength > serverConfig.transformLimit) {
        this.logger.error(`${changeset.resourceId}[action diff too large]${localActionLength}/${serverActions.length}`);
        throw new ServerException(OtException.REVISION_OVER_LIMIT);
      }
      // cross transform to generate new operations
      // For the principle, see  https://ones.ai/wiki/#/team/NqxK6uTp/space/L8swSDkE/page/GjwDGTz1
      const newOperations = localChangeset.operations.map(op => {
        const [leftOp, rightOp] = jot.transformX(op.actions, serverActions);
        serverActions = rightOp;

        for (const v of leftOp) {
          // Handling unsynchronized view settings. Client saving view settings will lead to entire replace of 'columns' field,
          // which is bad for transform.
          // So if 'columns' is being changed, and the lengths of 'oi' and 'oi' does not equal, throw an exception.
          if (v.p.includes('columns') && v['oi'] && v['od'] && v['oi'].length !== v['od'].length) {
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
   * Copy node in space
   *
   * @param data request parameters
   * @return boolean
   * @throws ServerException
   * @author Zoe Zheng
   * @date 2021/3/25 11:27 AM
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
    const store = await this.datasheetService.fillBaseSnapshotStoreByDstIds([...data.deleteNodeId, ...data.linkNodeId], { includeLink: false });
    const deleteNodeChangesets = this.datasheetChangesetService.getDeleteNodeChangesets(data, store);
    if (deleteNodeChangesets) {
      const { error } = await this.applyDstChangeset({
        roomId: deleteNodeChangesets[0]!.resourceId,
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
      return { error: error as ServerException };
    }
  }

  /**
   * New change
   *
   * only provides change for fusion api
   *
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
    // Notify socket service to broadcast
    await this.nestRoomChange(roomId, changeResult);
    this.logger.info('Resource:NotifyChangeSet Success!');
    return changeResult;
  }
}
