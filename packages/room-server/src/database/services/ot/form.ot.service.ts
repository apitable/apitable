import { Injectable } from '@nestjs/common';
import { IFormProps, IOperation, IRemoteChangeset, jot } from '@apitable/core';
import { InjectLogger } from '../../../shared/common';
import { ResourceChangesetEntity } from '../../entities/resource.changeset.entity';
import { OtException } from '../../../shared/exception/ot.exception';
import { PermissionException } from '../../../shared/exception/permission.exception';
import { ServerException } from '../../../shared/exception/server.exception';
import { IdWorker } from '../../../shared/helpers';
import { NodePermission } from 'shared/interfaces/axios.interfaces';
import { EffectConstantName, ICommonData } from 'database/services/ot/ot.interface';
// import { ResourceService } from 'modules/connectors/resource/resource.service';
import { ResourceMetaRepository } from '../../repositories/resource.meta.repository';
import { EntityManager } from 'typeorm';
import { Logger } from 'winston';

@Injectable()
export class FormOtService {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    // private readonly resourceService: ResourceService,
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

  async handleMeta(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
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
    await this.repository.updateMetaAndRevision(commonData.resourceId, commonData.userId, meta, commonData.revision);
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
