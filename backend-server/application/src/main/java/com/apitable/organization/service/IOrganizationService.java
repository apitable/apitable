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

import com.apitable.organization.dto.LoadSearchDTO;
import com.apitable.organization.vo.SubUnitResultVo;
import com.apitable.organization.vo.UnitInfoVo;
import com.apitable.organization.vo.UnitMemberVo;
import com.apitable.organization.vo.UnitSearchResultVo;
import com.apitable.organization.vo.UnitTeamVo;
import java.util.List;

/**
 * organization service.
 */
public interface IOrganizationService {

    /**
     * search unit.
     *
     * @param spaceId            space id
     * @param likeWord           keyword
     * @param highlightClassName the highlighted style
     * @return UnitSearchResultVo
     */
    UnitSearchResultVo findLikeUnitName(String spaceId, String likeWord, String highlightClassName);

    /**
     * query units in the the team.
     *
     * @param spaceId space id
     * @param teamId  team id
     * @return SubUnitResultVo
     */
    SubUnitResultVo findSubUnit(String spaceId, Long teamId);

    /**
     * query the team's unit info.
     *
     * @param spaceId space id
     * @param teamId  team id
     * @return UnitTeamVo
     */
    UnitTeamVo findUnitTeamVo(String spaceId, Long teamId);

    /**
     * query the teams' unit info.
     *
     * @param spaceId space id
     * @param teamIds team ids
     * @return UnitTeamVo List
     */
    List<UnitTeamVo> findUnitTeamVo(String spaceId, List<Long> teamIds);

    /**
     * find unit member.
     *
     * @param memberId member id
     * @return UnitMemberVo
     */
    UnitMemberVo finUnitMemberVo(Long memberId);

    /**
     * query the members' unit info.
     *
     * @param memberIds member ids
     * @return UnitMemberVo List
     */
    List<UnitMemberVo> findUnitMemberVo(List<Long> memberIds);

    /**
     * query admins information.
     *
     * @param memberIds member ids
     * @param spaceId   space id
     * @return admins information
     */
    List<UnitMemberVo> findAdminsVo(List<Long> memberIds, String spaceId);

    /**
     * load or search unit.
     *
     * @param userId  user id
     * @param spaceId space id
     * @param params  search key
     * @return UnitInfoVo
     */
    List<UnitInfoVo> loadOrSearchInfo(Long userId, String spaceId, LoadSearchDTO params,
                                      Long sharer);

    /**
     * accurate search.
     *
     * @param spaceId space id
     * @param names   unit names
     * @return UnitInfoVo
     */
    List<UnitInfoVo> accurateSearch(String spaceId, List<String> names);

    /**
     * Load the first department of the organization tree to which a member belongs.
     *
     * @param spaceId space id
     * @param teamIds team ids
     * @return SubUnitResultVo
     */
    SubUnitResultVo loadMemberFirstTeams(String spaceId, List<Long> teamIds);

    /**
     * Load the first department id of the organization tree to which a member belongs.
     *
     * @param teamIds team ids
     * @return teamIds
     */
    List<Long> loadMemberFirstTeamIds(List<Long> teamIds);
}
