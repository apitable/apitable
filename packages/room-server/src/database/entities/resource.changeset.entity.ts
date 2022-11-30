import { IOperation, ResourceType } from '@apitable/core';
import { BaseEntity } from 'shared/entities/base.entity';
import { IdWorker } from 'shared/helpers/snowflake';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Resource related operation collection, which includes datasheet
 */
@Entity(`resource_changeset`)
export class ResourceChangesetEntity {
  @PrimaryColumn('bigint')
    id: string;

  @Column({
    name: 'message_id',
    nullable: false,
    comment: 'unique identifier of a changeset request',
    length: 255,
  })
    messageId: string;

  @Column({
    name: 'resource_id',
    nullable: false,
    comment: 'resource ID',
    length: 50,
  })
    resourceId: string;

  @Column({
    name: 'resource_type',
    nullable: false,
    comment: 'resource type(0: datasheet, 1: form, 2: dashboard, 3: widget)',
    unsigned: true,
    default: () => 0,
  })
    resourceType: ResourceType;

  @Column({
    name: 'source_type',
    nullable: false,
    comment: 'source type(0: default)',
    unsigned: true,
    default: () => 0,
  })
    sourceType: number;

  @Column('json', {
    name: 'operations',
    nullable: true,
    comment: 'operation action collection',
  })
    operations: IOperation[] | null;

  @Column({
    name: 'revision',
    nullable: false,
    comment: 'revision',
    unsigned: true,
    default: () => 0,
  })
    revision: number;

  @Column('bigint', {
    name: 'created_by',
    comment: 'creator ID',
  })
    createdBy: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
