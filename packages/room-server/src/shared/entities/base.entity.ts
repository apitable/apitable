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

import { IdWorker } from 'shared/helpers/snowflake';
import { BeforeInsert, Column, PrimaryColumn } from 'typeorm';

/**
 * base entity class with common fields
 */
export abstract class BaseEntity {

  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'is_deleted',
    comment: 'wether it is deleted(0: no, 1: yes)',
    unsigned: true,
    default: () => false,
  })
  isDeleted!: boolean;

  @Column('bigint', {
    name: 'created_by',
    comment: 'user ID of creator',
  })
  createdBy!: string;

  @Column('bigint', {
    name: 'updated_by',
    comment: 'ID of use who last updated id',
  })
  updatedBy!: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column('timestamp', {
    name: 'updated_at',
    nullable: true,
    comment: 'updated time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = IdWorker.nextId().toString();
  }
}
