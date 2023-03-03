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

import { IJOTAction, IMirrorSnapshot, IOperation, IRemoteChangeset, IWidget, jot } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { EffectConstantName, ICommonData } from 'database/ot/interfaces/ot.interface';
import { WidgetService } from 'database/widget/services/widget.service';
import { InjectLogger } from 'shared/common';
import { OtException, PermissionException, ServerException } from 'shared/exception';
import { IdWorker } from 'shared/helpers';
import { NodePermission } from 'shared/interfaces';
import { EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { ResourceChangesetEntity } from '../../resource/entities/resource.changeset.entity';
import { WidgetEntity } from '../../widget/entities/widget.entity';
import { MetaService } from 'database/resource/services/meta.service';

@Injectable()
export class MirrorOtService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly widgetService: WidgetService,
    private readonly resourceMetaService: MetaService,
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
          // ===== Operations on widget panel =====
          // Insertion and deletion of widget panels and widgets require manageable permission
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
      // Recover widget in widget panel
      const addWidget = action['li'];
      resultSet.addWidgetIds.push(addWidget.id);
      return;
    }
    // Recover whole widget panel
    const panel = action['li'];
    const widgets: IWidget[] = panel.widgets;
    const ids = widgets.map(item => item.id);
    resultSet.addWidgetIds.push(...ids);
  }

  collectByDeleteWidgetOrWidgetPanels(action: IJOTAction, resultSet: { [key: string]: any }) {
    if (action.p.includes('widgets')) {
      // Delete widget in widget panel
      const deleteWidget = action['ld'];
      resultSet.deleteWidgetIds.push(deleteWidget.id);
      return;
    }
    // Delete whole widget panel
    const panel = action['ld'];
    const widgets: IWidget[] = panel.widgets;
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

    // Update database parallelly
    await Promise.all([
      // Update meta and revision
      this.handleMeta(manager, commonData, resultSet),
      // Always add changeset; operations and revision are stored as received from client, adding revision suffices
      this.createNewChangeset(manager, commonData, effectMap.get(EffectConstantName.RemoteChangeset)),
    ]);
  };

  async handleAddWidget(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug('[Start updating widget\'s add state]');
    }
    if (!resultSet.addWidgetIds.length) {
      return;
    }
    const deleteWidgetIds = await this.widgetService.getDelWidgetIdsByNodeId(commonData.resourceId);
    if (!deleteWidgetIds.length) {
      return;
    }
    this.logger.info('[ ======> Start batch adding widgets]');
    for (const widgetId of resultSet.addWidgetIds) {
      if (deleteWidgetIds.includes(widgetId)) {
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
      this.logger.debug('[Start updating widget\'s delete state]');
    }

    if (!resultSet.deleteWidgetIds.length) {
      return;
    }
    this.logger.info('[ ======> Start batch deleting widgets]');
    await manager.createQueryBuilder()
      .update(WidgetEntity)
      .set({ isDeleted: true })
      .where('widget_id IN(:...widgetIds)', { widgetIds: resultSet.deleteWidgetIds })
      .execute();
    this.logger.info('[ ======> Finished batch deleting widgets]');
  }

  async handleMeta(_manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${commonData.resourceId}] Update metadata`);
    }
    const metaData = await this.resourceMetaService.selectMetaByResourceId(commonData.resourceId);
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
    await this.resourceMetaService.updateMetaAndRevision(commonData.resourceId, commonData.userId!, meta, commonData.revision);
  }

  /**
   * Create new changeset and store it in database
   *
   * @param manager Database manager
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
}
