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
 * Workbench-Datasheet
 */
@Entity('datasheet')
export class DatasheetEntity extends BaseEntity {
  @Column({
    name: 'dst_id',
    nullable: true,
    unique: true,
    comment: 'datasheet ID',
    length: 50,
  })
  dstId?: string;

  @Column({
    name: 'node_id',
    nullable: true,
    comment: 'node ID (association#node#node_id)',
    length: 50,
  })
  nodeId?: string;

  @Column({
    name: 'dst_name',
    nullable: true,
    comment: 'datasheet name',
    length: 255,
  })
  dstName!: string;

  @Column({
    name: 'space_id',
    nullable: true,
    comment: 'space ID(related#space#space_id)',
    length: 50,
  })
  spaceId?: string;

  @Column({
    name: 'creator',
    nullable: true,
    comment: 'creator ID',
  })
  creator?: string;

  @Column({
    name: 'revision',
    nullable: true,
    comment: 'revision',
    unsigned: true,
    default: () => 0,
    type: 'bigint',
    width: 20,
  })
  revision!: number;
}
