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

import { UnitTeamEntity } from '../entities/unit.team.entity';
import { EntityRepository, In, Repository } from 'typeorm';

/**
 * Operations on table `unit_team`
 * 
 * @author Zoe zheng
 * @date 2020/7/30 4:09 PM
 */
@EntityRepository(UnitTeamEntity)
export class UnitTeamRepository extends Repository<UnitTeamEntity> {
  selectTeamsByIdsIncludeDeleted(teamIds: number[]): Promise<UnitTeamEntity[]> {
    return this.find({ select: ['id', 'teamName', 'groupId'], where: { id: In(teamIds) }});
  }

  selectIdBySpaceIdAndName(spaceId: string, teamName: string): Promise<{ id: string } | undefined> {
    return this.findOne({ select: ['id'], where: { teamName, spaceId, isDeleted: false }});
  }

  selectCountBySpaceIdAndId(id: string, spaceId: string): Promise<number> {
    return this.count({ where: { id, spaceId, isDeleted: false }});
  }
}
