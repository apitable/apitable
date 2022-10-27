import { DatasheetChangesetEntity } from '../entities/datasheet.changeset.entity';
import { DatasheetChangesetSourceEntity } from '../entities/datasheet.changeset.source.entity';
import { EntityRepository, In, Repository } from 'typeorm';

@EntityRepository(DatasheetChangesetEntity)
export class DatasheetChangesetRepository extends Repository<DatasheetChangesetEntity> {
  /**
   * 获取数表变更集的最大版本
   * 可能为null
   *
   * @param dstId 数表ID
   */
  getMaxRevisionByDstId(dstId: string): Promise<{ revision: string }> {
    return this.createQueryBuilder('vdc')
      .select('vdc.revision', 'revision')
      .where('vdc.dst_id = :dstId', { dstId })
      .andWhere('vdc.is_deleted = 0')
      .orderBy('vdc.revision', 'DESC')
      .limit(1)
      .getRawOne<{ revision: string }>();
  }

  /**
   * 查询变更集列表
   *
   * @param dstId 数表ID
   * @param revisions 版本列表
   */
  selectByDstIdAndRevisions(dstId: string, revisions: number[]): Promise<DatasheetChangesetEntity[]> {
    return this.find({
      where: [{ dstId, revision: In(revisions), isDeleted: false }],
    });
  }

  /**
   * 按顺序查询changeset
   *
   * @param dstId 数表ID
   * @param revisions 版本列表
   */
  getChangesetOrderList(dstId: string, revisions: string | number[]): Promise<any[]> {
    // sql和参数分别传入，防止 sql 注入
    return this.query(
      `
        SELECT vdc.message_id messageId, vu.uuid userId, vdc.revision, 
          vdc.dst_id resourceId, vdc.operations, vdc.created_at createdAt
        FROM vika_datasheet_changeset vdc
        LEFT JOIN vika_user vu ON vdc.created_by = vu.id
        WHERE vdc.is_deleted = 0 AND vdc.dst_id = ? AND vdc.revision IN (?)
        ORDER BY FIELD(vdc.revision, ?)
      `,
      [dstId, revisions, revisions],
    );
  }

  /**
   * 查询消息是否存在
   *
   * @param dstId 数表ID
   * @param messageId 消息ID
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
