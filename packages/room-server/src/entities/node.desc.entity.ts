import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * 工作台-节点表
 */
@Entity('vika_node_desc')
export class NodeDescEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'node_id',
    nullable: false,
    unique: true,
    comment: '节点Id(关联#vika_node#node_id)',
    length: 50,
  })
    nodeId: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: false,
    comment: '节点描述',
  })
    description: string | '';

  @Column('timestamp', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    nullable: true,
    comment: '更新时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    updatedAt: Date | null;
}
