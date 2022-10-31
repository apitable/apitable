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
   * 
   * @param dstIds datasheet ID array
   */
  selectRevisionByDstIds(dstIds: string[]): Promise<IResourceRevision[]> {
    return this.query(
      `
          SELECT dst_id resourceId, revision
          FROM vika_datasheet 
          WHERE dst_id IN (?) AND is_deleted = 0
        `,
      [dstIds],
    );
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
