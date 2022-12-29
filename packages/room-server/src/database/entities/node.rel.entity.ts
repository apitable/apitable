import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Workbench-Node Relationship
 */
@Entity(`node_rel`)
export class NodeRelEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'main_node_id',
    nullable: false,
    comment: 'main node ID',
    length: 50,
  })
    mainNodeId: string;

  @Column({
    name: 'rel_node_id',
    nullable: false,
    comment: 'related node ID',
    length: 50,
  })
    relNodeId: string;

  @Column('json', {
    name: 'extra',
    nullable: true,
    comment: 'other information',
  })
    extra?: string;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: 'creator ID',
  })
    createdBy?: string;

  @Column('timestamp', {
    name: 'created_at',
    nullable: false,
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;
}
