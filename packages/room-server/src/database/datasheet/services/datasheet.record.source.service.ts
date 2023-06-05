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
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { IdWorker } from 'shared/helpers';
import { DatasheetRecordSourceEntity } from '../entities/datasheet.record.source.entity';
import { DatasheetRecordSourceRepository } from '../../datasheet/repositories/datasheet.record.source.repository';
import { Span } from '@metinseylan/nestjs-opentelemetry';

@Injectable()
export class DatasheetRecordSourceService {
  constructor(private repository: DatasheetRecordSourceRepository) {}

  @Span()
  async createRecordSource(userId: string, dstId: string, sourceId: string, recordIds: string[], type: SourceTypeEnum) {
    const entities: any[] = [];
    for (const recordId of recordIds) {
      entities.push({
        id: IdWorker.nextId().toString(),
        dstId,
        sourceId,
        recordId,
        type,
        createdBy: userId?.length ? userId : null,
      });
    }
    await this.repository.createQueryBuilder()
      .insert()
      .into(DatasheetRecordSourceEntity)
      .values(entities)
      // If not set to false, SELECT will be executed after insertion, efficiency is impacted
      .updateEntity(false)
      .execute();
  }

  async fetchRecordSourceStatus(userId: string, dstId: string, sourceId: string, type: number) {
    return await this.repository.findOne({ where: [{ dstId, createdBy: userId, sourceId, type }] });
  }
}
