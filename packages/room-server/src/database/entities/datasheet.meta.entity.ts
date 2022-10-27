import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { IMeta } from '@apitable/core';

/**
 * 工作台-数表元数据表
 */
@Entity('vika_datasheet_meta')
export class DatasheetMetaEntity extends BaseEntity {

  @Column( {
    name: 'dst_id',
    nullable: true,
    comment: '数表自定义ID(关联#vika_datasheet#dst_id)',
    length: 50,
  })
    dstId: string | null;

  @Column('json', {
    name: 'meta_data',
    nullable: true,
    comment: '元数据',
  })
    metaData: IMeta | undefined;

  @Column('bigint', {
    name: 'revision',
    comment: '版本号',
    unsigned: true,
    default: () => 0,
  })
    revision: number;
}
