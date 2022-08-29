import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * 工作台-数表记录来源表
 */
@Entity('vika_datasheet_record_source')
export class DatasheetRecordSourceEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: '数表ID(关联#vika_datasheet#dst_id)',
    length: 50,
  })
    dstId: string | null;

  @Column({
    name: 'source_id',
    nullable: false,
    comment: '数据来源ID(一般为 nodeId)',
    length: 50,
  })
    sourceId: string | null;

  @Column({
    name: 'record_id',
    nullable: false,
    comment: '数据记录ID(关联#vika_datasheet_record#record_id)',
    length: 50,
  })
    recordId: string | null;

  @Column({
    name: 'type',
    nullable: false,
    comment: '数据来源类型(0:神奇表单;1:API)',
    width: 2,
    type: 'tinyint',
  })
    type: number;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: '创建者',
  })
    createdBy: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;
}
