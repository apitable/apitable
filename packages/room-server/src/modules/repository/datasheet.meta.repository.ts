import { IFieldMap } from '@vikadata/core';
import { DatasheetMetaEntity } from 'entities/datasheet.meta.entity';
import { EntityRepository, In, Repository } from 'typeorm';

@EntityRepository(DatasheetMetaEntity)
export class DatasheetMetaRepository extends Repository<DatasheetMetaEntity> {
  public selectMetaByDstId(dstId: string): Promise<DatasheetMetaEntity | undefined> {
    return this.findOne({ select: ['metaData'], where: [{ dstId, isDeleted: false }] });
  }

  /**
   * 获取数表metaData，忽略是否删除
   * @param dstId 数表ID
   * @return
   * @author Zoe Zheng
   * @date 2021/4/1 3:40 下午
   */
  selectMetaByDstIdIgnoreDeleted(dstId: string): Promise<DatasheetMetaEntity | undefined> {
    return this.findOne({ select: ['metaData'], where: [{ dstId }] });
  }

  /**
   * 根据数表ID数组查找meta
   * @param dstIds 数表ID数组
   * @return
   * @author Zoe Zheng
   * @date 2020/8/26 1:57 下午
   */
  selectMetaByDstIds(dstIds: string[]): Promise<DatasheetMetaEntity[]> {
    return this.find({ select: ['revision', 'metaData', 'dstId'], where: [{ dstId: In(dstIds), isDeleted: false }] });
  }

  /**
   * 根据数表ID数组查找meta, 忽略是否删除
   * @param dstIds 数表ID数组
   * @return
   * @author Zoe Zheng
   * @date 2021/4/1 3:49 下午
   */
  selectMetaByDstIdsIgnoreDeleted(dstIds: string[]): Promise<DatasheetMetaEntity[]> {
    return this.find({ select: ['revision', 'metaData', 'dstId'], where: [{ dstId: In(dstIds) }] });
  }

  selectFieldMapByDstId(dstId: string): Promise<{ fieldMap: IFieldMap }> {
    return this.createQueryBuilder('vdm')
      .select("vdm.meta_data->'$.fieldMap'", 'fieldMap')
      .where('vdm.dst_id = :dstId', { dstId })
      .andWhere('vdm.is_deleted = 0')
      .getRawOne<{ fieldMap: IFieldMap }>();
  }
}
