/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { IOperation, ResourceType } from '@apitable/core';
import { IdWorker } from 'shared/helpers/snowflake';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Resource related operation collection, which includes datasheet
 */
@Entity('resource_changeset')
export class ResourceChangesetEntity {
  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'message_id',
    nullable: false,
    comment: 'unique identifier of a changeset request',
    length: 255,
  })
  messageId!: string;

  @Column({
    name: 'resource_id',
    nullable: false,
    comment: 'resource ID',
    length: 50,
  })
  resourceId!: string;

  @Column({
    name: 'resource_type',
    nullable: false,
    comment: 'resource type(0: datasheet, 1: form, 2: dashboard, 3: widget)',
    unsigned: true,
    default: () => 0,
  })
  resourceType!: ResourceType;

  @Column({
    name: 'source_type',
    nullable: false,
    comment: 'source type(0: default)',
    unsigned: true,
    default: () => 0,
  })
  sourceType!: number;

  @Column('json', {
    name: 'operations',
    nullable: true,
    comment: 'operation action collection',
  })
  operations?: IOperation[];

  @Column({
    name: 'revision',
    nullable: false,
    comment: 'revision',
    unsigned: true,
    default: () => 0,
  })
  revision!: number;

  @Column('bigint', {
    name: 'created_by',
    comment: 'creator ID',
  })
  createdBy!: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
