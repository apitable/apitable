import { IOperation, ResourceType } from '@apitable/core';
import { IdWorker } from 'helpers/snowflake';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * resource 相关的操作合集，这里包括 datasheet 
 */
@Entity('vika_resource_changeset')
export class ResourceChangesetEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'message_id',
    nullable: false,
    comment: 'changeset请求的唯一标识，用于保证changeset的唯一',
    length: 255,
  })
    messageId: string;

  @Column({
    name: 'resource_id',
    nullable: false,
    comment: '资源ID',
    length: 50,
  })
    resourceId: string;

  @Column({
    name: 'resource_type',
    nullable: false,
    comment: '资源类型(0:数表;1:神奇表单;2:仪表盘;3:组件)',
    unsigned: true,
    default: () => 0,
  })
    resourceType: ResourceType;

  @Column({
    name: 'source_type',
    nullable: false,
    comment: '数据来源类型(0:默认)',
    unsigned: true,
    default: () => 0,
  })
    sourceType: number;

  @Column('json', {
    name: 'operations',
    nullable: true,
    comment: '操作action的合集',
  })
    operations: IOperation[] | null;

  @Column({
    name: 'revision',
    nullable: false,
    comment: '版本号',
    unsigned: true,
    default: () => 0,
  })
    revision: number;

  @Column('bigint', {
    name: 'created_by',
    comment: '创建者',
  })
    createdBy: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
