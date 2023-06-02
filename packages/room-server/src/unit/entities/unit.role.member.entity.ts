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

@Entity('unit_role_member')
export class UnitRoleMemberEntity {

  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'role_id',
    nullable: true,
    comment: 'team ID(related#role#id)',
    width: 20,
    type: 'bigint',
  })
  roleId?: number;

  @Column({
    name: 'unit_type',
    nullable: false,
    comment: 'unit type(1: department, 2: tag, 3:member)',
    width: 2,
    type: 'tinyint',
  })
  unitType!: number;

  @Column({
    name: 'unit_ref_id',
    nullable: false,
    comment: 'organization unit association ID',
    width: 20,
    type: 'bigint',
  })
  unitRefId!: number;

}
