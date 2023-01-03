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
 * Organization-Department
 */
@Entity('unit_team')
export class UnitTeamEntity extends BaseEntity {
  @Column({
    name: 'space_id',
    nullable: false,
    comment: 'space ID(related#space#space_id)',
    length: 50,
    type: 'varchar',
  })
  spaceId!: string;

  @Column({
    name: 'parent_id',
    nullable: false,
    comment: 'parent department ID, if it is the root department, it is 0',
    width: 20,
    type: 'bigint',
  })
  groupId!: number | 0;

  @Column({
    name: 'team_name',
    nullable: false,
    comment: 'department name',
    length: 100,
    type: 'varchar',
  })
  teamName!: string;

  @Column({
    name: 'team_level',
    nullable: false,
    comment: 'hierarchy, start from 1 by default',
    width: 5,
    type: 'int',
  })
  teamLevel!: number | 1;

  @Column({
    name: 'sequence',
    nullable: false,
    comment: 'sort in space (default starting from 1)',
    width: 11,
    type: 'int',
  })
  sequence!: number | 1;
}
