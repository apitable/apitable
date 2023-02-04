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

import { IResourceRevision } from '@apitable/core';
import { DatasheetEntity } from '../entities/datasheet.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(DatasheetEntity)
export class DatasheetRepository extends Repository<DatasheetEntity> {
  /**
   * Query an entity
   * 
   * @param dstId datasheet ID
   */
  public selectById(dstId: string): Promise<DatasheetEntity | undefined> {
    return this.findOne({ where: [{ dstId, isDeleted: false }] });
  }

  /**
   * Query the revision number of a datasheet.
   * 
   * @param dstId datasheet ID
   */
  selectRevisionByDstId(dstId: string): Promise<DatasheetEntity | undefined> {
    return this.findOne({
      select: ['revision'],
      where: [{ dstId, isDeleted: false }],
    });
  }

  /**
   * Query the revision numbers of multiple datasheets.
   * Notice: In fact, return data Revision is string type, not number type.
   *
   * @param dstIds datasheet ID array
   */
  public async selectRevisionByDstIds(dstIds: string[]): Promise<IResourceRevision[]> {
    return await this.createQueryBuilder()
      .select('dst_id', 'resourceId')
      .addSelect('revision')
      .where('dst_id IN (:...dstIds)', { dstIds })
      .andWhere('is_deleted = 0')
      .getRawMany<IResourceRevision>();
  }

  /**
   * Query the ID of the space which the given datasheet belongs to
   * 
   * @param dstId datasheet ID
   */
  selectSpaceIdByDstId(dstId: string): Promise<DatasheetEntity | undefined> {
    return this.findOne({
      select: ['spaceId'],
      where: [{ dstId, isDeleted: false }],
    });
  }

  selectBaseInfoByDstIds(dstIds: string[]): Promise<{ id: string; name: string; revision: string }[]> {
    return this.createQueryBuilder('vd')
      .select('vd.dst_id', 'id')
      .addSelect('vd.dst_name', 'name')
      .addSelect('vd.revision', 'revision')
      .where('vd.dst_id IN (:...dstIds)', { dstIds })
      .andWhere('vd.is_deleted = 0')
      .getRawMany<{ id: string; name: string; revision: string }>();
  }

  selectBaseInfoByDstIdsIgnoreDeleted(dstIds: string[]): Promise<{ id: string; name: string; revision: string }[]> {
    return this.createQueryBuilder('vd')
      .select('vd.dst_id', 'id')
      .addSelect('vd.dst_name', 'name')
      .addSelect('vd.revision', 'revision')
      .where('vd.dst_id IN (:...dstIds)', { dstIds })
      .getRawMany<{ id: string; name: string; revision: string }>();
  }
}
