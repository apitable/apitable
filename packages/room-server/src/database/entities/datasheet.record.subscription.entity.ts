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
import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Workbench-Datasheet Record Subscription
 */
@Entity('datasheet_record_subscription')
export class DatasheetRecordSubscriptionEntity extends BaseEntity {
  @PrimaryColumn('bigint')
  override id!: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: 'datasheet ID(related#datasheet#dst_id)',
    length: 50,
  })
  dstId!: string;

  @Column({
    name: 'mirror_id',
    nullable: true,
    comment: 'mirror ID',
    length: 50,
  })
  mirrorId?: string;

  @Column({
    name: 'record_id',
    nullable: false,
    comment: 'record ID(related#datasheet_record#record_id)',
    length: 50,
  })
  recordId!: string;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: 'creator ID(subscriber)',
  })
  override createdBy!: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  override createdAt!: Date;
}
