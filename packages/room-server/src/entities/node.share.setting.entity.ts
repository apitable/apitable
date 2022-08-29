import { IdWorker } from 'helpers/snowflake';
import { INodeShareProps } from 'interfaces/datasheet.interface';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * 节点分享设置表
 */
@Entity('vika_node_share_setting')
export class NodeShareSettingEntity {
  
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'node_id',
    comment: '节点Id',
    length: 50,
  })
    nodeId: string;

  @Column({
    name: 'share_id',
    nullable: true,
    comment: '分享唯一ID',
    length: 50,
  })
    shareId: string | null;

  @Column({
    name: 'is_enabled',
    comment: '可分享状态(0:关闭,1:开启)',
    unsigned: true,
    default: () => false,
  })
    isEnabled: boolean;

  @Column({
    name: 'allow_save',
    comment: '是否允许他人转存(0:否,1:是)',
    unsigned: true,
    default: () => false,
  })
    allowSave: boolean;

  @Column({
    name: 'allow_edit',
    comment: '是否允许他人编辑(0:否,1:是)',
    unsigned: true,
    default: () => false,
  })
    allowEdit: boolean;

  @Column('json', {
    name: 'props',
    nullable: true,
    comment: '分享选项参数',
  })
    props: INodeShareProps | null;

  @Column('bigint', {
    name: 'created_by',
    comment: '创建者',
  })
    createdBy: string;

  @Column('bigint', {
    name: 'updated_by',
    comment: '最后一次更新者',
  })
    updatedBy: string;

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

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
