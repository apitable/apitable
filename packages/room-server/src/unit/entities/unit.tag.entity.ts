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

import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'shared/entities/base.entity';

/**
 * Organizational structure-label table
 */
@Entity('unit_tag')
export class UnitTagEntity extends BaseEntity {
  @Column({
    name: 'group_id',
    nullable: true,
    comment: 'organization unit ID',
    width: 20,
    type: 'bigint',
  })
  groupId?: number;

  @Column({
    name: 'space_id',
    nullable: false,
    comment: 'space ID(related#space#space_id)',
    length: 50,
    type: 'varchar',
  })
  spaceId!: string;

  @Column({
    name: 'tag_name',
    nullable: false,
    comment: 'tag name',
    length: 100,
    type: 'varchar',
  })
  tagName!: string;

  @Column({
    name: 'sequence',
    nullable: false,
    comment: 'sort in space (default starting from 1)',
    width: 11,
    type: 'int',
  })
  sequence!: number | 1;
}
