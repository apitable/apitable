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
import { EffectConstantName, ICommonData } from 'database/services/ot/ot.interface';
import { ResourceService } from 'database/services/resource/resource.service';
import { WidgetService } from 'database/services/widget/widget.service';
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
        //  Modify widget name
        if (action.p[0] === 'widgetName') {
          if (!permission.editable) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          resultSet.updateWidgetName = action['oi'];
        }

        // Modify dependency datasheet ID of the widget
        if (action.p[0] === 'datasheetId') {
          if (!permission.editable) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          resultSet.updateWidgetDepDatasheetId = action['oi'];
        }
        // Modify dependency datasheet ID of the widget
        if (action.p[0] === 'sourceId') {
          if (!permission.editable) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
          resultSet.updateWidgetSourceId = action['oi'];
        }

        if (action.p[0] === 'storage') {
          // TODO: validate permission
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

    // ----- Start updating widget name
    await this.handleForWidgetName(manager, commonData, resultSet);
    // ----- Finished updating widget name

    // ----- Start updating widget name
    await this.handleForDepDatasheetId(manager, commonData, resultSet);
    // ----- Finished updating widget name

    // ----- Start updating widget storage
    await this.handleForStorage(manager, commonData, resultSet);
    // ----- Finished updating widget storage

    // Update database parallelly
    await Promise.all([
      // update meta
      // Always add changeset; operations and revision are stored as received from client, adding revision suffices
      this.createNewChangeset(manager, commonData, effectMap.get(EffectConstantName.RemoteChangeset)),
      // Update revision number of original datasheet
      this.updateRevision(manager, commonData),
    ]);
  };

  async handleForWidgetName(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${commonData.resourceId}] Modify name`);
    }
    if (!resultSet.updateWidgetName) {
      return;
    }
    const beginTime = Date.now();
    this.logger.info(`[${commonData.resourceId}] ====> Start storing changeset......`);
    await manager.update(WidgetEntity, { widgetId: commonData.resourceId }, { name: resultSet.updateWidgetName });
    const endTime = Date.now();
    this.logger.info(`[${commonData.resourceId}] ====> Finished storing changeset...... duration:${endTime - beginTime}`);

  }

  async handleForStorage(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${commonData.resourceId}] Update widget storage`);
    }
    if (!resultSet.storageAction.length) {
      return;
    }
    const beginTime = Date.now();
    this.logger.info(`[${commonData.resourceId}] ====> Start storing changeset......`);
    const storageData = await this.widgetService.getStorageByWidgetId(commonData.resourceId);

    // Merge meta
    try {
      jot.apply({ storage: storageData }, resultSet.storageAction);
    } catch (e) {
      this.logger.error(e);
      throw new ServerException(OtException.APPLY_META_ERROR);
    }

    await manager.update(WidgetEntity, { widgetId: commonData.resourceId }, { storage: storageData });
    const endTime = Date.now();
    this.logger.info(`[${commonData.resourceId}] ====> Finished storing changeset...... duration:${endTime - beginTime}`);
  }

  async handleForDepDatasheetId(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${commonData.resourceId}] Update widget datasheetId`);
    }
    if (!resultSet.updateWidgetDepDatasheetId) {
      return;
    }
    const beginTime = Date.now();
    const spaceId = await this.resourceService.getSpaceIdByResourceId(commonData.resourceId);
    this.logger.info(`[${commonData.resourceId}] ====> Start storing changeset......`);
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
    this.logger.info(`[${commonData.resourceId}] ====> Finished storing changeset...... duration:${endTime - beginTime}`);
  }

  /**
   * Create new changeset and store it in database
   * 
   * @param manager database manager
   * @param remoteChangeset changeset that is about to be stored
   */
  private async createNewChangeset(manager: EntityManager, commonData: ICommonData, remoteChangeset: IRemoteChangeset) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${remoteChangeset.resourceId}] Insert new changeset`);
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

  /**
   * @param manager database manager
   * @param dstId datasheet ID
   * @param revision revision number of the current update
   */
  private async updateRevision(manager: EntityManager, commonData: ICommonData) {
    const { resourceId, revision } = commonData;
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${resourceId}] Modify revision number of original datasheet`);
    }
    await manager.update(WidgetEntity, { widgetId: resourceId }, { revision });
  }
}
