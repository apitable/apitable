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

@Entity('unit_team_member_rel')
export class UnitTeamMemberRefEntity {

  @PrimaryColumn('bigint')
  id!: string;

  @Column({
    name: 'team_id',
    nullable: true,
    comment: 'team ID(related#team#id)',
    width: 20,
    type: 'bigint',
  })
  teamId?: number;

  @Column({
    name: 'member_id',
    nullable: false,
    comment: 'member ID(related#member#id)',
    width: 20,
    type: 'bigint',
  })
  memberId!: number;

}

