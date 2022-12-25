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
 * Workbench-Record Source
 */
@Entity('datasheet_record_source')
export class DatasheetRecordSourceEntity {
  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: 'datasheet ID(related#datasheet#dst_id)',
    length: 50,
  })
  dstId!: string;

  @Column({
    name: 'source_id',
    nullable: false,
    comment: 'source ID(generally is nodeId)',
    length: 50,
  })
  sourceId!: string;

  @Column({
    name: 'record_id',
    nullable: false,
    comment: 'record ID(related#datasheet_record#record_id)',
    length: 50,
  })
  recordId!: string;

  @Column({
    name: 'type',
    nullable: false,
    comment: 'source type(0: form, 1: API)',
    width: 2,
    type: 'tinyint',
  })
  type!: number;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: 'creator ID',
  })
  createdBy!: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
