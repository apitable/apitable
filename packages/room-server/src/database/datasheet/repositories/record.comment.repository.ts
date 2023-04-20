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

import { ICommentMsg } from '@apitable/core';
import { EntityRepository, Repository } from 'typeorm';
import { RecordCommentEntity } from '../entities/record.comment.entity';

@EntityRepository(RecordCommentEntity)
export class RecordCommentRepository extends Repository<RecordCommentEntity> {
  selectCommentsByDstIdAndRecordId(dstId: string, recordId: string): Promise<RecordCommentEntity[]> {
    return this.find({
      where: { dstId, recordId, isDeleted: false },
      select: ['commentMsg', 'commentId', 'createdAt', 'updatedAt', 'revision', 'createdBy', 'unitId'],
    });
  }

  selectRecordCommentCountByDstId(dstId: string): Promise<{ [recordId: string]: number }> {
    return this.createQueryBuilder('rc')
      .select('count(*)', 'count')
      .addSelect('rc.record_id', 'recordId')
      .where('rc.dst_id = :dstId', { dstId })
      .andWhere('rc.is_deleted = 0')
      .groupBy('rc.record_id')
      .getRawMany()
      .then(result => {
        return result.reduce<{ [recordId: string]: number }>((pre, cur) => {
          pre[cur.recordId] = parseInt(cur.count, 10);
          return pre;
        }, {});
      });
  }

  selectRevisionsByDstIdAndRecordId(dstId: string, recordId: string, excludeDeleted: boolean): Promise<{ revision: string }[] | undefined> {
    const query = this.createQueryBuilder('vrc')
      .select('vrc.revision', 'revision')
      .where('vrc.dst_id = :dstId', { dstId })
      .andWhere('vrc.record_id = :recordId', { recordId });
    if (excludeDeleted) {
      query.andWhere('vrc.is_deleted = 0');
    }
    return query.orderBy('vrc.revision', 'ASC').getRawMany<{ revision: string }>();
  }

  selectMentionedUnitIdByRevisions(dstId: string, recordId: string, revisions: number[]) {
    return this.createQueryBuilder('vrc')
      .select("vrc.comment_msg->'$.content.entityMap.*.data.mention.unitId'", 'unitIds')
      .addSelect("vrc.comment_msg->'$.emojis'", 'emojis')
      .where('vrc.dst_id = :dstId', { dstId })
      .andWhere('vrc.record_id = :recordId', { recordId })
      .andWhere('vrc.revision IN (:...revisions)', { revisions })
      .getRawMany();
  }

  selectEmojisByRevisions(dstId: string, recordId: string, revisions: number[]): Promise<{ emojis: any; commentId: string }[]> {
    return this.createQueryBuilder('vrc')
      .select("vrc.comment_msg->'$.emojis'", 'emojis')
      .addSelect('vrc.commentId', 'commentId')
      .where('vrc.dst_id = :dstId', { dstId })
      .andWhere('vrc.record_id = :recordId', { recordId })
      .andWhere('vrc.revision IN (:...revisions)', { revisions })
      .getRawMany();
  }

  selectCommentsByDstIdAndRecordIdAndCommentId(dstId: string, recordId: string, commentId: string): Promise<RecordCommentEntity | undefined> {
    return this.findOne({
      select: ['commentMsg', 'commentId', 'createdAt', 'updatedAt', 'revision', 'createdBy', 'unitId'],
      where: { dstId, recordId, commentId, isDeleted: false },
    });
  }

  selectCommentStateByCommentIds(
    dstId: string,
    recordId: string,
    commentIds: string[],
  ): Promise<{ commentId: string; commentMsg: ICommentMsg; commentState: number }[]> {
    return this.createQueryBuilder('vrc')
      .select('vrc.commentId', 'commentId')
      .addSelect('vrc.commentMsg', 'commentMsg')
      .addSelect('vrc.isDeleted', 'commentState')
      .where('vrc.dst_id = :dstId', { dstId })
      .andWhere('vrc.record_id = :recordId', { recordId })
      .andWhere('vrc.commentId IN (:...commentIds)', { commentIds })
      .getRawMany();
  }
}
