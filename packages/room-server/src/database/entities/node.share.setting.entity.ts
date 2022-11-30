import { IdWorker } from 'shared/helpers/snowflake';
import { INodeShareProps } from 'shared/interfaces/datasheet.interface';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Workbench-Node Share Settings
 */
@Entity(`node_share_setting`)
export class NodeShareSettingEntity {
  
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'node_id',
    comment: 'node Id',
    length: 50,
  })
    nodeId: string;

  @Column({
    name: 'share_id',
    nullable: true,
    comment: 'unique ID of sharing node',
    length: 50,
  })
    shareId: string | null;

  @Column({
    name: 'is_enabled',
    comment: 'can share status (0: Close, 1: Open)',
    unsigned: true,
    default: () => false,
  })
    isEnabled: boolean;

  @Column({
    name: 'allow_save',
    comment: 'whether to allow others to transfer (0: No, 1: Yes)',
    unsigned: true,
    default: () => false,
  })
    allowSave: boolean;

  @Column({
    name: 'allow_edit',
    comment: 'whether to allow others to edit (0: No, 1: Yes)',
    unsigned: true,
    default: () => false,
  })
    allowEdit: boolean;

  @Column('json', {
    name: 'props',
    nullable: true,
    comment: 'share option properties',
  })
    props: INodeShareProps | null;

  @Column('bigint', {
    name: 'created_by',
    comment: 'creator ID',
  })
    createdBy: string;

  @Column('bigint', {
    name: 'updated_by',
    comment: 'the user who last updated it',
  })
    updatedBy: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    nullable: true,
    comment: 'updated time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    updatedAt: Date | null;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
