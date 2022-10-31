import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { IRecordCellValue, IRecordMeta } from '@apitable/core';

/**
 * Workbench-Datasheet Record
 */
@Entity('vika_datasheet_record')
export class DatasheetRecordEntity extends BaseEntity {
  @Column({
    name: 'record_id',
    nullable: true,
    comment: 'record ID',
    length: 50,
  })
    recordId: string | null;

  @Column({
    name: 'dst_id',
    nullable: true,
    comment: 'datasheet ID(related#vika_datasheet#dst_id)',
    length: 50,
  })
    dstId: string | null;

  @Column('json', {
    name: 'data',
    nullable: true,
    comment: 'data recorded by a line (corresponding to each field)',
  })
    data: IRecordCellValue | null;

  @Column({
    name: 'revision_history',
    nullable: true,
    comment: 'revisions of the original operations, sorted by revision, indices are revisions of the record',
    length: 5000,
    default: () => '0',
  })
    revisionHistory: string | null;

  @Column({
    name: 'revision',
    nullable: true,
    comment: 'revision',
    unsigned: true,
    default: () => '0',
  })
    revision: number | null;

  @Column('json', {
    name: 'field_updated_info',
    nullable: true,
    comment: 'field(cell) update information',
  })
    recordMeta?: IRecordMeta;
}
