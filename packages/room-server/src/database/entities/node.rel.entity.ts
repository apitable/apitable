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
 * Workbench-Node Relationship
 */
@Entity('node_rel')
export class NodeRelEntity {
  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'main_node_id',
    nullable: false,
    comment: 'main node ID',
    length: 50,
  })
  mainNodeId!: string;

  @Column({
    name: 'rel_node_id',
    nullable: false,
    comment: 'related node ID',
    length: 50,
  })
  relNodeId!: string;

  @Column('json', {
    name: 'extra',
    nullable: true,
    comment: 'other information',
  })
  extra?: string;

  @Column('bigint', {
    name: 'created_by',
    nullable: true,
    comment: 'creator ID',
  })
  createdBy?: string;

  @Column('timestamp', {
    name: 'created_at',
    nullable: false,
    comment: 'created time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
