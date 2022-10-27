import { Injectable } from '@nestjs/common';
import { IOperation, IRemoteChangeset, jot } from '@apitable/core';
import { InjectLogger } from '../../../shared/common';
import { DatasheetWidgetEntity } from '../../entities/datasheet.widget.entity';
import { ResourceChangesetEntity } from '../../entities/resource.changeset.entity';
import { WidgetEntity } from '../../entities/widget.entity';
import { OtException } from '../../../shared/exception/ot.exception';
import { PermissionException } from '../../../shared/exception/permission.exception';
import { ServerException } from '../../../shared/exception/server.exception';
import { IdWorker } from '../../../shared/helpers';
import { NodePermission } from 'shared/interfaces/axios.interfaces';
import { EffectConstantName, ICommonData } from 'datasheet/services/ot/ot.interface';
import { ResourceService } from 'datasheet/services/resource/resource.service';
import { WidgetService } from 'datasheet/services/widget/widget.service';
import { EntityManager } from 'typeorm';
import { Logger } from 'winston';

@Injectable()
export class WidgetOtService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly resourceService: ResourceService,
    private readonly widgetService: WidgetService
  ) { }

  createResultSet() {
    return {
      updateWidgetDepDatasheetId: '',
      updateWidgetSourceId: '',
      updateWidgetName: '',
      storageAction: [],
    };
  }

  analyseOperates(operations: IOperation[], permission: NodePermission, resultSet: { [key: string]: any }) {
    operations.forEach(op => {
      op.actions.forEach(action => {
        //  修改组件名称
        if (action.p[0] === 'widgetName') {
          if (!permission.editable) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          resultSet.updateWidgetName = action['oi'];
        }

        // 修改组件依赖的 数表 ID
        if (action.p[0] === 'datasheetId') {
          if (!permission.editable) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          resultSet.updateWidgetDepDatasheetId = action['oi'];
        }
        // 修改组件依赖的 数表 ID
        if (action.p[0] === 'sourceId') {
          if (!permission.editable) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          resultSet.updateWidgetSourceId = action['oi'];
        }

        if (action.p[0] === 'storage') {
          // TODO: 确定下权限
          resultSet.storageAction.push(action);
        }
      });
    });

    return this.transaction;

  }

  transaction = async(
    manager: EntityManager,
    effectMap: Map<string, any>,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) => {

    // ----- 更新 widget name 开始
    await this.handleForWidgetName(manager, commonData, resultSet);
    // ----- 更新 widget name 结束

    // ----- 更新 widget name 开始
    await this.handleForDepDatasheetId(manager, commonData, resultSet);
    // ----- 更新 widget name 结束

    // ----- 更新 widget storage 开始
    await this.handleForStorage(manager, commonData, resultSet);
    // ----- 更新 widget storage 结束

    // 并行执行更新数据库
    await Promise.all([
      // 更新Meta
      // 无论如何都添加changeset，operations和revision按照客户端传输过来的一样保存，叠加版本号即可
      this.createNewChangeset(manager, commonData, effectMap.get(EffectConstantName.RemoteChangeset)),
      // 更改主表操作版本号
      this.updateRevision(manager, commonData),
    ]);
  };

  async handleForWidgetName(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${commonData.resourceId}] 修改名称`);
    }
    if (!resultSet.updateWidgetName) {
      return;
    }
    const beginTime = Date.now();
    this.logger.info(`[${commonData.resourceId}] ====> 数据库保存变更集开始......`);
    await manager.update(WidgetEntity, { widgetId: commonData.resourceId }, { name: resultSet.updateWidgetName });
    const endTime = Date.now();
    this.logger.info(`[${commonData.resourceId}] ====> 数据库保存变更集结束...... 总时间:${endTime - beginTime}`);

  }

  async handleForStorage(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${commonData.resourceId}] 更新组件 storage`);
    }
    if (!resultSet.storageAction.length) {
      return;
    }
    const beginTime = Date.now();
    this.logger.info(`[${commonData.resourceId}] ====> 数据库保存变更集开始......`);
    const storageData = await this.widgetService.getStorageByWidgetId(commonData.resourceId);

    // 合并Meta
    try {
      jot.apply({ storage: storageData }, resultSet.storageAction);
    } catch (e) {
      this.logger.error(e);
      throw new ServerException(OtException.APPLY_META_ERROR);
    }

    await manager.update(WidgetEntity, { widgetId: commonData.resourceId }, { storage: storageData });
    const endTime = Date.now();
    this.logger.info(`[${commonData.resourceId}] ====> 数据库保存变更集结束...... 总时间:${endTime - beginTime}`);
  }

  async handleForDepDatasheetId(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${commonData.resourceId}] 更新组件 datasheetId`);
    }
    if (!resultSet.updateWidgetDepDatasheetId) {
      return;
    }
    const beginTime = Date.now();
    const spaceId = await this.resourceService.getSpaceIdByResourceId(commonData.resourceId);
    this.logger.info(`[${commonData.resourceId}] ====> 数据库保存变更集开始......`);
    await manager.createQueryBuilder()
      .insert()
      .into(DatasheetWidgetEntity)
      .values([{
        id: IdWorker.nextId().toString(),
        spaceId,
        dstId: resultSet.updateWidgetDepDatasheetId,
        sourceId: resultSet.updateWidgetSourceId || null,
        widgetId: commonData.resourceId,
      }])
      .updateEntity(false)
      .execute();
    const endTime = Date.now();
    this.logger.info(`[${commonData.resourceId}] ====> 数据库保存变更集结束...... 总时间:${endTime - beginTime}`);
  }

  /**
   * 创建新的changeset存储db
   * @param manager 数据库管理器
   * @param remoteChangeset 存储db的changeset
   */
  private async createNewChangeset(manager: EntityManager, commonData: ICommonData, remoteChangeset: IRemoteChangeset) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${remoteChangeset.resourceId}]插入新变更集`);
    }
    const beginTime = +new Date();
    this.logger.info(`[${remoteChangeset.resourceId}] ====> 数据库保存变更集开始......`);
    const { userId } = commonData;
    await manager.createQueryBuilder()
      .insert()
      .into(ResourceChangesetEntity)
      .values([{
        id: IdWorker.nextId().toString(),
        messageId: remoteChangeset.messageId,
        resourceId: remoteChangeset.resourceId,
        resourceType: remoteChangeset.resourceType,
        operations: remoteChangeset.operations,
        revision: remoteChangeset.revision,
        createdBy: userId,
      }])
      .updateEntity(false)
      .execute();
    const endTime = +new Date();
    this.logger.info(`[${remoteChangeset.resourceId}] ====> 数据库保存变更集结束......总耗时: ${endTime - beginTime}ms`);
  }

  /**
   * @param manager 数据库管理器
   * @param dstId 数表id
   * @param revision 本次提交的版本号
   */
  private async updateRevision(manager: EntityManager, commonData: ICommonData) {
    const { resourceId, revision } = commonData;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${resourceId}]修改主表操作版本号`);
    }
    await manager.update(WidgetEntity, { widgetId: resourceId }, { revision });
  }
}
