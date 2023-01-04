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

import { IFormProps, IOperation, IRemoteChangeset, jot } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { EffectConstantName, ICommonData } from 'database/ot/interfaces/ot.interface';
import { InjectLogger } from 'shared/common';
import { OtException, PermissionException, ServerException } from 'shared/exception';
import { IdWorker } from 'shared/helpers';
import { NodePermission } from 'shared/interfaces/axios.interfaces';
import { EntityManager } from 'typeorm';
import { Logger } from 'winston';
import { ResourceChangesetEntity } from 'database/resource/entities/resource.changeset.entity';
import { ResourceMetaRepository } from 'database/resource/repositories/resource.meta.repository';

@Injectable()
export class FormOtService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly repository: ResourceMetaRepository,
  ) { }

  createResultSet() {
    return {
      metaActions: []
    };
  }

  analyseOperates(operations: IOperation[], permission: NodePermission, resultSet: { [key: string]: any }) {
    operations.forEach(op => {
      op.actions.forEach(action => {
        // Modify form props
        if (action.p[0] === 'formProps' && 'oi' in action && 'od' in action) {
          if (!permission.editable) {
            throw new ServerException(PermissionException.OPERATION_DENIED);
          }
        }
      });
      resultSet.metaActions.push(...op.actions);
    });

    return this.transaction;

  }

  transaction = async(
    manager: EntityManager,
    effectMap: Map<string, any>,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) => {

    // Update database parallelly
    await Promise.all([
      // Update meta
      this.handleMeta(manager, commonData, resultSet),
      // Always add changeset; operations and revision are stored as received from client, adding revision suffices
      this.createNewChangeset(manager, commonData, effectMap.get(EffectConstantName.RemoteChangeset)),
    ]);
  };

  async handleMeta(
    _manager: EntityManager,
    commonData: ICommonData,
    resultSet: { [key: string]: any }
  ) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${commonData.resourceId}] Update metadata`);
    }
    const metaData = await this.repository.selectMetaByResourceId(commonData.resourceId);
    try {
      jot.apply({ formProps: metaData }, resultSet.metaActions);
    } catch (error) {
      this.logger.error(error);
      throw new ServerException(OtException.APPLY_META_ERROR);
    }
    await this.updateMetaDataAndRevision(metaData as IFormProps, commonData);
  }

  async updateMetaDataAndRevision(meta: IFormProps, commonData: ICommonData) {
    await this.repository.updateMetaAndRevision(commonData.resourceId, commonData.userId!, meta, commonData.revision);
  }

  /**
   * Create new changeset and store it in database
   * @param manager Database manager
   * @param remoteChangeset changeset that is about to be stored in database
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
