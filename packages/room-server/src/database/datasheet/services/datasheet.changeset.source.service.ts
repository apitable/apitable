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

import { Injectable } from '@nestjs/common';
import { IRemoteChangeset } from '@apitable/core';
import { DatasheetChangesetSourceEntity } from '../entities/datasheet.changeset.source.entity';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { IdWorker } from '../../../shared/helpers';
import { DatasheetChangesetSourceRepository } from '../../datasheet/repositories/datasheet.changeset.source.repository';

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
