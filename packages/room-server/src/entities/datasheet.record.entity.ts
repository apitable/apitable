import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IRecordCellValue, IRecordMeta } from '@vikadata/core';

/**
 * 工作台-数表记录表
 */
@Entity('vika_datasheet_record')
export class DatasheetRecordEntity extends BaseEntity {
  @Column({
    name: 'record_id',
    nullable: true,
    comment: '操作ID',
    length: 50,
  })
    recordId: string | null;

  @Column({
    name: 'dst_id',
    nullable: true,
    comment: '数表ID(关联#vika_datasheet#dst_id)',
    length: 50,
  })
    dstId: string | null;

  @Column('json', {
    name: 'data',
    nullable: true,
    comment: '一行记录的数据（对应每个字段）',
  })
    data: IRecordCellValue | null;

  @Column({
    name: 'revision_history',
    nullable: true,
    comment: '按排序的历史版本号，是原 Operation 的revision，数组下标是当前 record 的 revision',
    length: 5000,
    default: () => '0',
  })
    revisionHistory: string | null;

  @Column({
    name: 'revision',
    nullable: true,
    comment: '版本号',
    unsigned: true,
    default: () => '0',
  })
    revision: number | null;

  @Column('json', {
    name: 'field_updated_info',
    nullable: true,
    comment: '单元格更新信息',
  })
    recordMeta?: IRecordMeta;
}
