import { Injectable } from '@nestjs/common';
import { IJOTAction, IMirrorSnapshot, IOperation, IRemoteChangeset, jot } from '@apitable/core';
import { InjectLogger } from '../../../shared/common';
import { ResourceChangesetEntity } from '../../entities/resource.changeset.entity';
import { WidgetEntity } from '../../entities/widget.entity';
import { PermissionException } from '../../../shared/exception/permission.exception';
import { ServerException } from '../../../shared/exception/server.exception';
import { IdWorker } from '../../../shared/helpers';
import { NodePermission } from '../../../shared/interfaces';
import { EffectConstantName, ICommonData } from 'datasheet/services/ot/ot.interface';
import { ResourceMetaRepository } from '../../repositories/resource.meta.repository';
import { EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { OtException } from '../../../shared/exception/ot.exception';
import { WidgetService } from 'datasheet/services/widget/widget.service';

@Injectable()
export class MirrorOtService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly widgetService: WidgetService,
    private readonly repository: ResourceMetaRepository,
  ) { }

  createResultSet() {
    return {
      metaActions: [],
      deleteWidgetIds: [],
      addWidgetIds: [],
    };
  }

  analyseOperates(operations: IOperation[], permission: NodePermission, resultSet: { [key: string]: any }) {

    operations.map(item => {
      item.actions.forEach(action => {
        if (action.p[0] === 'widgetPanels') {
          // ===== 组件面板的操作 =====
          // 组件面板及组件的增删均需要可管理角色
          if ('ld' in action) {
            if (!permission.manageable) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            this.collectByDeleteWidgetOrWidgetPanels(action, resultSet);
          }
          if ('li' in action) {
            if (!permission.manageable) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            this.collectByAddWidgetIds(action, resultSet);
          }
        }
      });

      resultSet.metaActions.push(...item.actions);
    });

    return this.transaction;
  }

  collectByAddWidgetIds(action: IJOTAction, resultSet: { [key: string]: any }) {
    if (action.p.includes('widgets')) {
      // 恢复组件板中的组件
      const addWidget = action['li'];
      resultSet.addWidgetIds.push(addWidget.id);
      return;
    }
    // 恢复整个组件面板
    const panel = action['li'];
    const widgets = panel.widgets;
    const ids = widgets.map(item => item.id);
    resultSet.addWidgetIds.push(...ids);
  }

  collectByDeleteWidgetOrWidgetPanels(action: IJOTAction, resultSet: { [key: string]: any }) {
    if (action.p.includes('widgets')) {
      // 删除组件板中的组件
      const deleteWidget = action['ld'];
      resultSet.deleteWidgetIds.push(deleteWidget.id);
      return;
    }
    // 删除整个组件面板
    const panel = action['ld'];
    const widgets = panel.widgets;
    const ids = widgets.map(item => item.id);
    resultSet.deleteWidgetIds.push(...ids);
  }

  transaction = async(
    manager: EntityManager,
    effectMap: Map<string, any>,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) => {

    await this.handleAddWidget(manager, commonData, resultSet);

    await this.handleDeleteWidget(manager, resultSet);

    // 并行执行更新数据库
    await Promise.all([
      // 更新Meta 和 版本号
      this.handleMeta(manager, commonData, resultSet),
      // 无论如何都添加changeset，operations和revision按照客户端传输过来的一样保存，叠加版本号即可
      this.createNewChangeset(manager, commonData, effectMap.get(EffectConstantName.RemoteChangeset)),
    ]);
  };

  async handleAddWidget(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('[开始更新 widget 的 add 状态]');
    }
    if (!resultSet.addWidgetIds.length) {
      return;
    }
    const deleteWidgetIds = await this.widgetService.getDelWidgetIdsByNodeId(commonData.resourceId);
    if (!deleteWidgetIds.length) {
      return;
    }
    this.logger.info('[ ======> 批量新增 widget 开始]');
    for (const widgetId of resultSet.addWidgetIds) {
      if (deleteWidgetIds.includes(widgetId)) {
        await manager.createQueryBuilder()
          .update(WidgetEntity)
          .set({ isDeleted: false })
          .where('widget_id=:widgetId', { widgetId: widgetId })
          .execute();
      }
    }
    this.logger.info('[ ======> 批量新增 widget 结束]');
  }

  async handleDeleteWidget(manager: EntityManager, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('[开始更新 widget 的 delete 状态]');
    }

    if (!resultSet.deleteWidgetIds.length) {
      return;
    }
    this.logger.info('[ ======> 批量删除 widget 开始]');
    await manager.createQueryBuilder()
      .update(WidgetEntity)
      .set({ isDeleted: true })
      .where('widget_id IN(:...widgetIds)', { widgetIds: resultSet.deleteWidgetIds })
      .execute();
    this.logger.info('[ ======> 批量删除 widget 结束]');
  }

  async handleMeta(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${commonData.resourceId}] 更新 Metadata`);
    }
    const metaData = await this.repository.selectMetaByResourceId(commonData.resourceId);
    const _metaData = { widgetPanels: [], ...metaData };
    try {
      jot.apply(_metaData, resultSet.metaActions);
    } catch (error) {
      this.logger.error(error);
      throw new ServerException(OtException.APPLY_META_ERROR);
    }
    await this.updateMetaDataAndRevision(_metaData as IMirrorSnapshot, commonData);
  }

  async updateMetaDataAndRevision(meta: IMirrorSnapshot, commonData: ICommonData) {
    await this.repository.updateMetaAndRevision(commonData.resourceId, commonData.userId, meta, commonData.revision);
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
}
