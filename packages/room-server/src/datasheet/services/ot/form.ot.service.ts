import { Injectable } from '@nestjs/common';
import { IFormProps, IOperation, IRemoteChangeset, jot } from '@apitable/core';
import { InjectLogger } from '../../../shared/common';
import { ResourceChangesetEntity } from '../../entities/resource.changeset.entity';
import { OtException } from '../../../shared/exception/ot.exception';
import { PermissionException } from '../../../shared/exception/permission.exception';
import { ServerException } from '../../../shared/exception/server.exception';
import { IdWorker } from '../../../shared/helpers';
import { NodePermission } from 'shared/interfaces/axios.interfaces';
import { EffectConstantName, ICommonData } from 'datasheet/services/ot/ot.interface';
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
        //  修改收集表自有属性
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

    // 并行执行更新数据库
    await Promise.all([
      // 更新Meta
      this.handleMeta(manager, commonData, resultSet),
      // 无论如何都添加changeset，operations和revision按照客户端传输过来的一样保存，叠加版本号即可
      this.createNewChangeset(manager, commonData, effectMap.get(EffectConstantName.RemoteChangeset)),
    ]);
  };

  async handleMeta(manager: EntityManager, commonData: ICommonData, resultSet: { [key: string]: any }) {
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`[${commonData.resourceId}] 更新 Metadata`);
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
