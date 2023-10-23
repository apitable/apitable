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
import {
  DatasheetRecordArchiveEntity,
} from '../entities/datasheet.record.archive.entity';
import { chunk } from 'lodash';

@EntityRepository(DatasheetRecordArchiveEntity)
export class DatasheetRecordArchiveRepository extends Repository<DatasheetRecordArchiveEntity> {

  async getArchiveStatusByDstIdAndRecordId(dstId: string, recordId: string): Promise<boolean> {
    return await this.findOne({
      where: { dstId, recordId, isDeleted: false },
      select: ['isArchived'],
    }).then(entity => {
      return entity == null ? false : entity.isArchived;
    });
  }

  async getArchivedRecordIdsByDstId(dstId: string): Promise<Set<String>> {
    return await this.find({
      where: { dstId, isArchived: true, isDeleted: false },
      select: ['recordId'],
    }).then(entities => {
      return new Set(entities.map(entity => entity.recordId));
    });
  }

  async getArchivedRecordIdsByDstIdAndRecordIds(dstId: string, recordIds: string[]): Promise<Set<String>> {
    let dbMethod = async (dstId: string, recordIds: string[]) => {
      let entities = await this.find({
        where: { dstId, recordId: In(recordIds), isArchived: true, isDeleted: false },
        select: ['recordId'],
      });
      return entities.map(entity => entity.recordId);
    };

    let batchRecordIds = chunk(recordIds, 1000);

    let promise = [];
    for (let batchRecordId of batchRecordIds) {
      promise.push(dbMethod(dstId, batchRecordId));
    }

    let promiseResult = await Promise.all(promise);

    let results = promiseResult.reduce((pre: String[], cur) => {
      return pre.concat(cur);
    }, []);
    return new Set<String>(results);
  }

  async countRowsByDstId(dstId: string): Promise<number> {
    return await this.count({ where: [{ dstId, isArchived: true, isDeleted: false }] });
  }

  async getArchivedRecords(dstId: string, pageSize: number, offset: number) {
    return await this.find({
      where: { dstId, isArchived: true, isDeleted: false },
      order: { archivedAt: 'DESC' },
      take: pageSize,
      skip: offset,
    });
  }

}
