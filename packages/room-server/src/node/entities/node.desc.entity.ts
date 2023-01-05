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
 * Workbench-Node Description
 */
@Entity('node_desc')
export class NodeDescEntity {
  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'node_id',
    nullable: false,
    unique: true,
    comment: 'node Id(related#node#node_id)',
    length: 50,
  })
  nodeId!: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: false,
    comment: 'node description',
    default: () => '',
  })
  description!: string;

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
  updatedAt!: Date;
}
