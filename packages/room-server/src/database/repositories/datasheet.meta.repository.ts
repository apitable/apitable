import { IFieldMap } from '@apitable/core';
import { DatasheetMetaEntity } from '../entities/datasheet.meta.entity';
import { EntityRepository, In, Repository } from 'typeorm';

@EntityRepository(DatasheetMetaEntity)
export class DatasheetMetaRepository extends Repository<DatasheetMetaEntity> {
  public selectMetaByDstId(dstId: string): Promise<DatasheetMetaEntity | undefined> {
    return this.findOne({ select: ['metaData'], where: [{ dstId, isDeleted: false }] });
  }

  /**
   * Obtain the metadata of a datasheet, ignoring `isDeleted` state.
   *
   * @param dstId datasheet ID
   * @return
   * @author Zoe Zheng
   * @date 2021/4/1 3:40 PM
   */
  selectMetaByDstIdIgnoreDeleted(dstId: string): Promise<DatasheetMetaEntity | undefined> {
    return this.findOne({ select: ['metaData'], where: [{ dstId }] });
  }

  /**
   * Obtain the metadata list by datasheet ID list
   *
   * @param dstIds datasheet ID array
   * @return
   * @author Zoe Zheng
   * @date 2020/8/26 1:57 PM
   */
  selectMetaByDstIds(dstIds: string[]): Promise<DatasheetMetaEntity[]> {
    return this.find({ select: ['revision', 'metaData', 'dstId'], where: [{ dstId: In(dstIds), isDeleted: false }] });
  }

  /**
   * Obtain the metadata list by datasheet ID list, ignoring `isDeleted` state
   *
   * @param dstIds datasheet ID array
   * @return
   * @author Zoe Zheng
   * @date 2021/4/1 3:49 PM
   */
  selectMetaByDstIdsIgnoreDeleted(dstIds: string[]): Promise<DatasheetMetaEntity[]> {
    return this.find({ select: ['revision', 'metaData', 'dstId'], where: [{ dstId: In(dstIds) }] });
  }

  selectFieldMapByDstId(dstId: string): Promise<{ fieldMap: IFieldMap }> {
    return this.createQueryBuilder('vdm')
      .select('vdm.meta_data->\'$.fieldMap\'', 'fieldMap')
      .where('vdm.dst_id = :dstId', { dstId })
      .andWhere('vdm.is_deleted = 0')
      .getRawOne<{ fieldMap: IFieldMap }>();
  }

  countRowsByDstId(dstId: string): Promise<{ count: number }> {
    return this.createQueryBuilder('vdm')
      .select('IFNULL(SUM(JSON_LENGTH( vdm.meta_data -> \'$.views[0].rows\' )), 0)', 'count')
      .where('vdm.dst_id = :dstId', { dstId })
      .andWhere('vdm.is_deleted = 0')
      .getRawOne<{ count: number }>();
  }
}
