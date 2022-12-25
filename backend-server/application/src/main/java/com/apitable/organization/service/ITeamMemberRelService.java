/*
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

package com.apitable.organization.service;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.apitable.organization.entity.TeamMemberRelEntity;

public interface ITeamMemberRelService extends IService<TeamMemberRelEntity> {

    /**
     * member associated team
     *
     * @param memberIds member ids
     * @param teamIds team ids
     */
    void addMemberTeams(List<Long> memberIds, List<Long> teamIds);

    /**
     * @param entities ref
     */
    void createBatch(List<TeamMemberRelEntity> entities);

    /**
     *
     * @param memberId member id
     * @return the member's teams id
     */
    List<Long> getTeamByMemberId(Long memberId);

    /**
     * @param teamId team id
     * @return the team's member ids
     */
    List<Long> getMemberIdsByTeamId(Long teamId);

    /**
     * delete member from all teams.
     *
     * @param memberId member id
     */
    void removeByMemberId(Long memberId);

    /**
     * delete members from all teams.
     *
     * @param memberIds member ids
     */
    void removeByMemberIds(List<Long> memberIds);

    /**
     * @param teamId team id
     */
    void removeByTeamId(Long teamId);

    /**
     * @param teamIds team ids
     */
    void removeByTeamIds(Collection<Long> teamIds);

    /**
     * remove by member id and team id list
     * @param memberId member id
     * @param teamIds team id list
     */
    void removeByTeamIdsAndMemberId(Long memberId, List<Long> teamIds);
}
