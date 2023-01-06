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

@Entity('datasheet_record_alarm')
export class DatasheetRecordAlarmEntity extends BaseEntity {
  @Column({
    name: 'alarm_id',
    nullable: false,
    unique: true,
    comment: 'alarm ID',
    length: 50,
  })
  alarmId!: string;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: 'space ID',
    length: 50,
  })
  spaceId!: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    comment: 'datasheet ID',
    length: 50,
  })
  dstId!: string;

  @Column({
    name: 'record_id',
    nullable: false,
    comment: 'datasheet record ID',
    length: 50,
  })
  recordId!: string;

  @Column({
    name: 'field_id',
    nullable: false,
    comment: 'datasheet field ID',
    length: 50,
  })
  fieldId!: string;

  @Column({
    name: 'alarm_at',
    nullable: false,
    comment: 'alarm time',
  })
  alarmAt!: Date;

  @Column({
    name: 'alarm_status',
    nullable: false,
    comment: 'alarm status(0-pending, 1-processing, 2-done, 3-failed)',
    width: 1,
    type: 'tinyint',
    default: () => 0,
  })
  status!: number;
}