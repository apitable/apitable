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
import { DatasheetChangesetEntity } from '../entities/datasheet.changeset.entity';
import { DatasheetChangesetSourceEntity } from '../entities/datasheet.changeset.source.entity';

@EntityRepository(DatasheetChangesetEntity)
export class DatasheetChangesetRepository extends Repository<DatasheetChangesetEntity> {
  /**
   * Obtain max revision number of datasheet changesets. May be null.
   *
   * @param dstId datasheet ID
   */
  getMaxRevisionByDstId(dstId: string): Promise<{ revision: string } | undefined> {
    return this.createQueryBuilder('vdc')
      .select('vdc.revision', 'revision')
      .where('vdc.dst_id = :dstId', { dstId })
      .andWhere('vdc.is_deleted = 0')
      .orderBy('vdc.revision', 'DESC')
      .limit(1)
      .getRawOne<{ revision: string }>();
  }

  /**
   * Obtain changset list with the given revision numbers
   *
   * @param dstId datasheet ID
   * @param revisions revision number list
   */
  selectByDstIdAndRevisions(dstId: string, revisions: number[]): Promise<DatasheetChangesetEntity[]> {
    return this.find({
      where: [{ dstId, revision: In(revisions), isDeleted: false }],
    });
  }

  /**
   * Obtain changeset list with the given revision numbers, in their order.
   *
   * @param dstId datasheet ID
   * @param startRevision
   * @param endRevision
   */
  getChangesetOrderList(dstId: string, startRevision: number, endRevision: number): Promise<any[]> {
    // todo(itou): replace dynamic sql
    return this.query(
      `
        SELECT vdc.message_id messageId, vu.uuid userId, vdc.revision, 
          vdc.dst_id resourceId, vdc.operations, vdc.created_at createdAt
        FROM ${this.manager.connection.options.entityPrefix}datasheet_changeset vdc
        LEFT JOIN ${this.manager.connection.options.entityPrefix}user vu ON vdc.created_by = vu.id
        WHERE vdc.dst_id = ? AND vdc.revision >= ? AND vdc.revision < ? AND vdc.is_deleted = 0
        ORDER BY vdc.revision
      `,
      [dstId, startRevision, endRevision],
    );
  }

  /**
   * Query if a message exists
   *
   * @param dstId datasheet ID
   * @param messageId message ID
   */
  countByDstIdAndMessageId(dstId: string, messageId: string): Promise<number> {
    return this.createQueryBuilder('vdc')
      .where('vdc.dst_id = :dstId', { dstId })
      .andWhere('vdc.message_id = :messageId', { messageId })
      .andWhere('vdc.is_deleted = 0')
      .getCount();
  }

  selectDetailByDstIdAndRevisions(dstId: string, revisions: string[]): Promise<(DatasheetChangesetEntity & { isComment: string })[]> {
    return this.createQueryBuilder('vdc')
      .select('vdc.revision', 'revision')
      .addSelect('vdc.message_id', 'messageId')
      .addSelect('CAST(vdc.operations as JSON)', 'operations')
      .addSelect('vdc.createdBy', 'createdBy')
      .addSelect('vdc.createdAt', 'createdAt')
      .addSelect("IF (vdc.operations->'$[0].cmd' = 'InsertComment', 1, 0)", 'isComment')
      .where('vdc.dst_id = :dstId', { dstId })
      .andWhere('vdc.revision IN (:...revisions)', { revisions })
      .orderBy('vdc.revision', 'DESC')
      .getRawMany<DatasheetChangesetEntity & { isComment: string }>();
  }

  selectRevisionsByDstIdAndLimitDays(dstId: string, revisions: string[], limitDays: number): Promise<{ revision: string }[] | undefined> {
    return this.createQueryBuilder('vdc')
      .select('vdc.revision', 'revision')
      .where('vdc.dst_id = :dstId', { dstId })
      .andWhere('vdc.revision IN (:...revisions)', { revisions })
      .andWhere(qb => {
        const subQuery = qb
          .subQuery()
          .select('vdcs.message_id')
          .from(DatasheetChangesetSourceEntity, 'vdcs')
          .where('vdcs.dst_id = :dstId', { dstId })
          .andWhere('vdcs.source_type = 2')
          .getQuery();
        return 'vdc.message_id NOT IN ' + subQuery;
      })
      .andWhere('vdc.is_deleted = 0')
      .andWhere('DATE_SUB(CURDATE(), INTERVAL :limitDays DAY) <= date(vdc.created_at)', { limitDays })
      .orderBy('vdc.revision', 'ASC')
      .getRawMany();
  }
}
