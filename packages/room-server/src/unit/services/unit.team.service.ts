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

import { Injectable } from '@nestjs/common';
import { IUserValue, MemberType } from '@apitable/core';
import { UnitTeamRepository } from '../repositories/unit.team.repository';

/**
 * unitTeam related operations
 * 
 * @author Zoe zheng
 * @date 2020/7/30 6:31 PM
 */
@Injectable()
export class UnitTeamService {
  constructor(private readonly teamRepo: UnitTeamRepository) { }

  /**
   * Get team base info by team ids
   * 
   * @param teamIds
   * @return IUnitTeamBaseInfoMap
   * @author Zoe Zheng
   * @date 2020/7/30 5:39 PM
   */
  public async getTeamsByIdsIncludeDeleted(teamIds: number[]): Promise<{ [teamId: string]: IUserValue }> {
    if (teamIds.length > 0) {
      const teams = await this.teamRepo.selectTeamsByIdsIncludeDeleted(teamIds);
      return teams.reduce<{ [teamId: string]: IUserValue }>((pre, cur) => {
        pre[cur.id] = { name: cur.teamName, uuid: '', userId: '', type: MemberType.Team, isDeleted: cur.isDeleted };
        return pre;
      }, {});
    }
    return {};
  }

  async getIdBySpaceIdAndName(spaceId: string, teamName: string): Promise<string | null> {
    const entity = await this.teamRepo.selectIdBySpaceIdAndName(spaceId, teamName);
    if (entity) return entity.id;
    return null;
  }
}
