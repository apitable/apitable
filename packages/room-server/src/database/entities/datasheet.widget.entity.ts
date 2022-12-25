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

import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { IdWorker } from 'shared/helpers';

@Entity('datasheet_widget')
export class DatasheetWidgetEntity {
  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'dst_id',
    nullable: false,
    unique: true,
    comment: 'datasheet ID(related#datasheet#dst_id)',
    length: 50,
  })
  dstId!: string;

  @Column({
    name: 'source_id',
    nullable: true,
    unique: true,
    comment: 'source(referenced by widget) ID, such as mirror ID',
    length: 50,
    default: () => null,
  })
  sourceId?: string;

  @Column({
    name: 'space_id',
    nullable: false,
    unique: true,
    comment: 'space ID',
    length: 50,
  })
  spaceId!: string;

  @Column({
    name: 'widget_id',
    nullable: false,
    unique: true,
    comment: 'widget ID',
    length: 50,
  })
  widgetId!: string;

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
