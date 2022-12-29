import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { IMeta } from '@apitable/core';

/**
 * Workbench-Datasheet Meta
 */
@Entity(`datasheet_meta`)
export class DatasheetMetaEntity extends BaseEntity {

  @Column( {
    name: 'dst_id',
    nullable: true,
    comment: 'datasheet ID(related#datasheet#dst_id)',
    length: 50,
  })
    dstId: string | null;

  @Column('json', {
    name: 'meta_data',
    nullable: true,
    comment: 'meta data',
  })
    metaData: IMeta | undefined;

  @Column('bigint', {
    name: 'revision',
    comment: 'revision',
    unsigned: true,
    default: () => 0,
  })
    revision: number;
}
