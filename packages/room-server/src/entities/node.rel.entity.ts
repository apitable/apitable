import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * 工作台-节点关联表
 */
@Entity('vika_node_rel')
export class NodeRelEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'main_node_id',
    nullable: false,
    comment: '主节点ID',
    length: 50,
  })
    mainNodeId: string;

  @Column({
    name: 'rel_node_id',
    nullable: false,
    comment: '关联节点ID',
    length: 50,
  })
    relNodeId: string;

  @Column('json', {
    name: 'extra',
    nullable: true,
    comment: '其他信息',
  })
    extra?: string;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: '创建者',
  })
    createdBy?: string;

  @Column('timestamp', {
    name: 'created_at',
    nullable: false,
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;
}
