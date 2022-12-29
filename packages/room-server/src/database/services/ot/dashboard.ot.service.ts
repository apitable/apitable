import { Injectable } from '@nestjs/common';
import { IDashboardSnapshot, IOperation, IRemoteChangeset, jot } from '@apitable/core';
import { InjectLogger } from '../../../shared/common';
import { ResourceChangesetEntity } from '../../entities/resource.changeset.entity';
import { WidgetEntity } from '../../entities/widget.entity';
import { PermissionException } from '../../../shared/exception/permission.exception';
import { ServerException } from '../../../shared/exception/server.exception';
import { IdWorker } from '../../../shared/helpers';
import { NodePermission } from '../../../shared/interfaces';
import { EffectConstantName, ICommonData } from 'database/services/ot/ot.interface';
import { ResourceMetaRepository } from '../../repositories/resource.meta.repository';
import { EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { OtException } from '../../../shared/exception/ot.exception';
import { WidgetService } from 'database/services/widget/widget.service';

@Injectable()
export class DashboardOtService {
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
        if ('oi' in action || 'li' in action) {
          if (action.p[0] === 'widgetInstallations') {
            if (!permission.manageable) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            this.logger.info(`dashboard operations log =====> :${JSON.stringify(operations)}`);
            if ('oi' in action) {
              resultSet.addWidgetIds.push(action['oi'].id);
            }
            if ('li' in action) {
              resultSet.addWidgetIds.push(action['li'].id);
            }
          }
        }

        if ('ld' in action || 'od' in action) {
          if (action.p[0] === 'widgetInstallations') {
            if (!permission.manageable) {
              throw new ServerException(PermissionException.OPERATION_DENIED);
            }
            if ('ld' in action) {
              resultSet.deleteWidgetIds.push(action['ld'].id);
            }
            if ('od' in action) {
              resultSet.deleteWidgetIds.push(action['od'].id);
            }
          }
        }
      });

      resultSet.metaActions.push(...item.actions);
    });

    return this.transaction;
  }

  transaction = async(
    manager: EntityManager,
    effectMap: Map<string, any>,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) => {

    await this.handleAddWidget(manager, commonData, resultSet);

    await this.handleDeleteWidget(manager, resultSet);

    // update database parallelly
    await Promise.all([
      // update meta and revision
      this.handleMeta(manager, commonData, resultSet),
      // Always add changeset; operations and revision are stored as received from client, adding revision suffices
      this.createNewChangeset(manager, commonData, effectMap.get(EffectConstantName.RemoteChangeset)),
    ]);
  };

  async handleAddWidget(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('[Start updating widget\'s add state]');
    }
    if (!resultSet.addWidgetIds.length) { return; }
    const deleteWidgetIds = await this.widgetService.getDelWidgetIdsByNodeId(commonData.resourceId);
    if (!deleteWidgetIds.length) { return; }
    this.logger.info('[ ======> Start batch adding widgets]');
    for (const widgetId of resultSet.addWidgetIds) {
      if (widgetId && deleteWidgetIds.includes(widgetId)) {
        await manager.createQueryBuilder()
          .update(WidgetEntity)
          .set({ isDeleted: false })
          .where('widget_id=:widgetId', { widgetId: widgetId })
          .execute();
      }
    }
    this.logger.info('[ ======> Finished batch adding widgets]');
  }

  async handleDeleteWidget(manager: EntityManager, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('[Starting update widget\'s delete state]');
    }

    if (!resultSet.deleteWidgetIds.length) { return; }
    this.logger.info('[ ======> Start batch deleting widgets]');
    await manager.createQueryBuilder()
      .update(WidgetEntity)
      .set({ isDeleted: true })
      .where('widget_id IN(:...widgetIds)', { widgetIds: resultSet.deleteWidgetIds })
      .execute();
    this.logger.info('[ ======> Finished batch deleting widgets]');
  }

  async handleMeta(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${commonData.resourceId}] Update metadata`);
    }
    const metaData = await this.repository.selectMetaByResourceId(commonData.resourceId);
    try {
      jot.apply({ widgetInstallations: metaData }, resultSet.metaActions);
    } catch (error) {
      this.logger.error(error);
      throw new ServerException(OtException.APPLY_META_ERROR);
    }
    await this.updateMetaDataAndRevision(metaData as IDashboardSnapshot, commonData);
  }

  async updateMetaDataAndRevision(meta: IDashboardSnapshot, commonData: ICommonData) {
    await this.repository.updateMetaAndRevision(commonData.resourceId, commonData.userId, meta, commonData.revision);
  }

  /**
   * Create new changeset and store it in database
   * 
   * @param manager Database manager
   * @param remoteChangeset changeset that will be stored in database
   */
  private async createNewChangeset(manager: EntityManager, commonData: ICommonData, remoteChangeset: IRemoteChangeset) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${remoteChangeset.resourceId}] Insert changeset`);
    }
    const beginTime = +new Date();
    this.logger.info(`[${remoteChangeset.resourceId}] ====> Start storing changeset......`);
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
    this.logger.info(`[${remoteChangeset.resourceId}] ====> Finished storing changeset......duration: ${endTime - beginTime}ms`);
  }
}
