import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * 工作台-数表变更集来源表
 */
@Entity('vika_datasheet_changeset_source')
export class DatasheetChangesetSourceEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: '数表ID(关联#vika_datasheet#dst_id)',
    length: 50,
  })
    dstId: string;

  @Column({
    name: 'resource_id',
    nullable: false,
    comment: '数据来源ID(一般为 nodeId)',
    length: 50,
  })
    resourceId: string;

  @Column({
    name: 'message_id',
    nullable: false,
    comment: 'changeset请求的唯一标识，用于保证resource changeset的唯一',
    length: 255,
  })
    messageId: string;

  @Column({
    name: 'source_id',
    nullable: true,
    comment: '数据来源ID',
    length: 50,
  })
    sourceId: string | undefined;

  @Column({
    name: 'source_type',
    nullable: false,
    comment: '数据来源类型(0:user_interface,1:openapi,2:relation_effect)',
    width: 2,
    type: 'tinyint',
  })
    sourceType: number;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: '创建者',
    default: null,
  })
    createdBy: string | undefined;

  @Column('timestamp', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;
}
