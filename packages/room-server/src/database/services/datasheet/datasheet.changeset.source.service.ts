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
   * Batch create source info for changesets
   * 
   * @param changesets changesets from server 
   * @param sourceType changeset source
   * @return
   * @author Zoe Zheng
   * @date 2021/4/16 5:27 PM
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
    // Store changeset source
    await this.changesetSourceRepository.insert(changesetSourceEntities);
  }
}
