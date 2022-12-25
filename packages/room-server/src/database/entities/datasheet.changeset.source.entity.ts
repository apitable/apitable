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

import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Workbench-Datasheet Changeset Source
 */
@Entity('datasheet_changeset_source')
export class DatasheetChangesetSourceEntity {
  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: 'datasheet ID (associated#datasheet#dst_id)',
    length: 50,
  })
  dstId!: string;

  @Column({
    name: 'resource_id',
    nullable: false,
    comment: 'source ID(generally is nodeId)',
    length: 50,
  })
  resourceId!: string;

  @Column({
    name: 'message_id',
    nullable: false,
    comment: 'Unique identifier of a changeset request',
    length: 255,
  })
  messageId!: string;

  @Column({
    name: 'source_id',
    nullable: true,
    comment: 'source ID',
    length: 50,
  })
  sourceId?: string;

  @Column({
    name: 'source_type',
    nullable: false,
    comment: 'source type (0: user_interface, 1: Openapi, 2: related_effect)',
    width: 2,
    type: 'tinyint',
  })
  sourceType!: number;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: 'creator ID',
    default: null,
  })
  createdBy?: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
