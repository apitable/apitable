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

import { IRecordCellValue, IRecordMeta } from '@apitable/core';
import { BaseEntity } from 'shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

/**
 * Workbench-Datasheet Record
 */
@Entity('datasheet_record')
export class DatasheetRecordEntity extends BaseEntity {
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

  @Column('json', {
    name: 'data',
    nullable: true,
    comment: 'data recorded by a line (corresponding to each field)',
  })
  data?: IRecordCellValue;

  @Column({
    name: 'revision_history',
    nullable: true,
    comment: 'revisions of the original operations, sorted by revision, indices are revisions of the record',
    length: 5000,
    default: () => '0',
  })
  revisionHistory?: string;

  @Column({
    name: 'revision',
    nullable: true,
    comment: 'revision',
    unsigned: true,
    default: () => 0,
  })
  revision!: number;

  @Column('json', {
    name: 'field_updated_info',
    nullable: true,
    comment: 'field(cell) update information',
  })
  recordMeta?: IRecordMeta;
}
