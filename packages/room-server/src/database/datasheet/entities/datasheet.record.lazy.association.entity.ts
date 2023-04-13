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

import { IRecordDependencies } from '@apitable/core';
import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * datasheet record lazy association
 */
@Entity('datasheet_record_lazy_association')
export class DatasheetRecordLazyAssociationEntity {

  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'space_id',
    nullable: true,
    comment: 'space ID',
    length: 50,
  })
  spaceId!: string;

  @Column({
    name: 'dst_id',
    nullable: true,
    comment: 'datasheet ID',
    length: 50,
  })
  dstId!: string;

  @Column({
    name: 'record_id',
    nullable: true,
    comment: 'record ID',
    length: 50,
  })
  recordId!: string;

  @Column('json', {
    name: 'depends',
    nullable: true,
    comment: 'record dependencies(related datasheets\' records and fields)',
  })
  depends!: IRecordDependencies;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column('timestamp', {
    name: 'updated_at',
    nullable: true,
    comment: 'updated time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  // @BeforeInsert()
  // beforeInsert() {
  //   this.id = IdWorker.nextId().toString();
  // }
}
