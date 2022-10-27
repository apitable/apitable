import { Injectable } from '@nestjs/common';
import { IRemoteChangeset } from '@apitable/core';
import { DatasheetChangesetSourceEntity } from '../../entities/datasheet.changeset.source.entity';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { IdWorker } from '../../../shared/helpers';
import { DatasheetChangesetSourceRepository } from '../../repositories/datasheet.changeset.source.repository';

@Injectable()
export class DatasheetChangesetSourceService {
  constructor(
    private readonly changesetSourceRepository: DatasheetChangesetSourceRepository,
  ) {}

  /**
   * 批量创建changesets的来源信息
   * @param changesets 服务端返回的changeset
   * @param sourceType changeset来源
   * @return
   * @author Zoe Zheng
   * @date 2021/4/16 5:27 下午
   */
  async batchCreateChangesetSource(changesets: IRemoteChangeset[], sourceType: SourceTypeEnum, sourceId?: string) {
    const changesetSourceEntities: DatasheetChangesetSourceEntity[] = changesets.map(changeset => {
      const entity = new DatasheetChangesetSourceEntity();
      entity.id = IdWorker.nextId().toString();
      entity.createdBy = changeset.userId;
      entity.dstId = changeset.resourceId;
      entity.resourceId = changeset.resourceId;
      entity.messageId = changeset.messageId;
      entity.sourceId = sourceId ? sourceId : changeset.resourceId;
      entity.sourceType = sourceType;
      return entity;
    });
    // 保存changeset来源
    await this.changesetSourceRepository.insert(changesetSourceEntities);
  }
}
