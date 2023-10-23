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

import { EntityRepository, In, Repository } from 'typeorm';
import { DatasheetRecordEntity } from '../entities/datasheet.record.entity';

@EntityRepository(DatasheetRecordEntity)
export class DatasheetRecordRepository extends Repository<DatasheetRecordEntity> {
  selectRecordsDataByDstId(dstId: string): Promise<DatasheetRecordEntity[] | undefined> {
    return this.find({
      select: ['recordId', 'data', 'recordMeta'],
      where: [{ dstId, isDeleted: false }],
    });
  }

  selectRecordsDataByDstIdIgnoreDeleted(dstId: string): Promise<DatasheetRecordEntity[] | undefined> {
    return this.find({
      select: ['recordId', 'data', 'recordMeta'],
      where: [{ dstId }],
    });
  }

  selectRevisionHistoryByDstIdAndRecordId(dstId: string, recordId: string): Promise<{ revisionHistory: string } | undefined> {
    return this.createQueryBuilder('vdr')
      .select('vdr.revision_history', 'revisionHistory')
      .where('vdr.dst_id = :dstId', { dstId })
      .andWhere('vdr.record_id = :recordId', { recordId })
      .andWhere('vdr.is_deleted = 0')
      .getRawOne<{ revisionHistory: string }>();
  }

  selectLinkRecordIdsByRecordIdAndFieldId(dstId: string, recordId: string, fieldId: string) {
    const path = `$.${fieldId}`;
    // todo(itou): replace dynamic sql
    return this.query(
      `
       SELECT vdr.data->?  as linkRecordIds
       FROM ${this.manager.connection.options.entityPrefix}datasheet_record vdr
       WHERE vdr.dst_id = ? AND vdr.record_id = ? AND vdr.is_deleted = 0 limit 1
      `,
      [path, dstId, recordId],
    );
  }

  selectDeletedCountByDstIdAndRecordIs(dstId: string, recordIds: string[]): Promise<number> {
    return this.count({ where: [{ dstId, recordId: In(recordIds), isDeleted: true }] });
  }
}
