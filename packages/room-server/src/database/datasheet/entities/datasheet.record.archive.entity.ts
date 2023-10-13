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

import { BaseEntity } from 'shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

/**
 * Workbench-Datasheet Record archive
 */
@Entity('datasheet_record_archive')
export class DatasheetRecordArchiveEntity extends BaseEntity {
  @Column({
    name: 'record_id',
    nullable: true,
    comment: 'record ID',
    length: 50,
  })
  recordId!: string;

  @Column({
    name: 'dst_id',
    nullable: true,
    comment: 'datasheet ID(related#datasheet#dst_id)',
    length: 50,
  })
  dstId!: string;

  @Column({
    name: 'is_archived',
    comment: 'whether it is archived(0: no, 1: yes)',
    unsigned: true,
    default: () => false,
  })
  isArchived!: boolean;

  @Column('bigint', {
    name: 'archived_by',
    comment: 'ID of use who last archived id',
  })
  archivedBy!: string;

  @Column('timestamp', {
    name: 'archived_at',
    comment: 'archived time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  archivedAt!: Date;
}
