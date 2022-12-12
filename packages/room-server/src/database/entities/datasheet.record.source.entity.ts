import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Workbench-Record Source
 */
@Entity(`datasheet_record_source`)
export class DatasheetRecordSourceEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: 'datasheet ID(related#datasheet#dst_id)',
    length: 50,
  })
    dstId: string | null;

  @Column({
    name: 'source_id',
    nullable: false,
    comment: 'source ID(generally is nodeId)',
    length: 50,
  })
    sourceId: string | null;

  @Column({
    name: 'record_id',
    nullable: false,
    comment: 'record ID(related#datasheet_record#record_id)',
    length: 50,
  })
    recordId: string | null;

  @Column({
    name: 'type',
    nullable: false,
    comment: 'source type(0: form, 1: API)',
    width: 2,
    type: 'tinyint',
  })
    type: number;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: 'creator ID',
  })
    createdBy: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;
}
