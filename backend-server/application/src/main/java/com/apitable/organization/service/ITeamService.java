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

import com.apitable.organization.dto.MemberIsolatedInfo;
import com.apitable.organization.dto.TeamBaseInfoDTO;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.vo.MemberPageVo;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.vo.TeamInfoVo;
import com.apitable.organization.vo.TeamTreeVo;
import com.apitable.organization.vo.UnitTeamVo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

/**
 * team service.
 */
public interface ITeamService extends IService<TeamEntity> {

    /**
     * Get space id.
     *
     * @param teamId team table ID
     * @return Space ID
     * @author Chambers
     */
    String getSpaceIdByTeamId(Long teamId);

    /**
     * Get Team Base Information.
     *
     * @param teamIds team ids
     * @return TeamBaseInfoDTO list
     */
    List<TeamBaseInfoDTO> getTeamBaseInfo(List<Long> teamIds);

    /**
     * Get team Tree.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @param depth    recursive depth, min 1
     * @return team tree
     */
    List<TeamTreeVo> getTeamTree(String spaceId, Long memberId, Integer depth);

    /**
     * Get all team id in team tree.
     *
     * @param teamId team id
     * @return AllTeamId
     */
    List<Long> getAllTeamIdsInTeamTree(Long teamId);

    /**
     * Get all team id in team tree.
     *
     * @param teamIds team ids
     * @return AllTeamId
     * @author Chambers
     */
    List<Long> getAllTeamIdsInTeamTree(List<Long> teamIds);

    /**
     * Check whether the team has members or teams.
     *
     * @param spaceId space id
     * @param teamId  team id
     * @return true | false
     */
    boolean checkHasSubUnitByTeamId(String spaceId, Long teamId);

    /**
     * check whether members are isolated from contacts.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @return MemberIsolatedInfo
     */
    MemberIsolatedInfo checkMemberIsolatedBySpaceId(String spaceId, Long memberId);

    /**
     * count the team's members, includes the sub teams' members.
     *
     * @param teamId team id
     * @return the member amount
     */
    long countMemberCountByParentId(Long teamId);

    /**
     * count the teams' members, only count self teams' members.
     *
     * @param teamIds team ids
     * @return the member amount
     */
    long getMemberCount(List<Long> teamIds);

    /**
     * get member id by team id.
     *
     * @param teamIds team ids
     * @return the members id
     */
    List<Long> getMemberIdsByTeamIds(List<Long> teamIds);

    /**
     * get root team id.
     *
     * @param spaceId space id
     * @return root team id
     */
    Long getRootTeamId(String spaceId);

    /**
     * get root team unit id.
     *
     * @param spaceId space id
     * @return root team's unit id
     */
    Long getRootTeamUnitId(String spaceId);

    /**
     * Gets the organizational unit for the team and all parent teams.
     *
     * @param teamId team id
     * @return teams' unit id
     */
    List<Long> getUnitsByTeam(Long teamId);

    /**
     * get parent team id.
     *
     * @param teamId team id
     * @return parent team's id
     */
    Long getParentId(Long teamId);

    /**
     * Get the maximum sorting value of sub team in the team.
     *
     * @param parentId parent team's id
     * @return the sort value
     */
    int getMaxSequenceByParentId(Long parentId);

    /**
     * Create a root team and synchronize the root team with the space name.
     *
     * @param spaceId   space id
     * @param spaceName space name
     * @return root team id
     */
    Long createRootTeam(String spaceId, String spaceName);

    /**
     * save batch team.
     *
     * @param spaceId  space id
     * @param entities teams
     */
    void batchCreateTeam(String spaceId, List<TeamEntity> entities);

    /**
     * create team.
     *
     * @param spaceId space id
     * @param name    team name
     * @param superId parent team id
     * @return team id
     */
    Long createSubTeam(String spaceId, String name, Long superId);

    /**
     * create subTeam.
     *
     * @param spaceId  space id
     * @param name     team name
     * @param superId  parent team id
     * @param sequence team order
     * @return team id
     */
    Long createSubTeam(String spaceId, String name, Long superId, Integer sequence);

    /**
     * create subTeam.
     *
     * @param spaceId  space id
     * @param name     team name
     * @param superId  parent team id
     * @param sequence team order
     * @param roleIds  role is list
     * @return team id
     */
    Long createSubTeam(String spaceId, String name, Long superId, Integer sequence,
                       List<Long> roleIds);

    /**
     * batch insert team by name
     * !!!Designed for uploading data processing, otherwise use don't use.
     *
     * @param spaceId    space id
     * @param rootTeamId root id
     * @param teamNames  team names(such as：[level one, level two, level three])
     * @return team ids
     */
    List<Long> createBatchByTeamName(String spaceId, Long rootTeamId, List<String> teamNames);

    /**
     * get the lowest department id in the teamNames.
     *
     * @param spaceId   space id
     * @param teamNames team path，such as： [A,B,C]
     * @return team id
     */
    Long getByTeamNamePath(String spaceId, List<String> teamNames);

    /**
     * get team info view by team id.
     *
     * @param teamId team id, root team default 0
     * @return TeamInfoVo
     */
    TeamInfoVo getTeamInfoById(Long teamId);

    /**
     * update team name.
     *
     * @param teamId   team id
     * @param teamName team name
     */
    void updateTeamName(Long teamId, String teamName);

    /**
     * adjust the team hierarchy.
     *
     * @param teamId   team id
     * @param teamName team name
     * @param parentId parent team id
     */
    void updateTeamParent(Long teamId, String teamName, Long parentId);

    /**
     * update team.
     *
     * @param team    team
     * @param roleIds team roles
     */
    void updateTeam(TeamEntity team, List<Long> roleIds);

    /**
     * delete team.
     *
     * @param teamId team id
     */
    void deleteTeam(Long teamId);

    /**
     * batch delete team.
     *
     * @param teamIds team ids
     */
    void deleteTeam(Collection<Long> teamIds);

    /**
     * Count the number of people in the team in the space. the team's members include sub teams'.
     *
     * @param spaceId space id
     * @param id      teamId
     * @return TeamTreeVos
     */
    List<TeamTreeVo> build(String spaceId, Long id);

    /**
     * Count the number of people in the teams in the space. the team's members include sub teams'.
     *
     * @param spaceId space id
     * @param teamIds team ids
     * @return TeamTreeVos
     */
    List<TeamTreeVo> buildTree(String spaceId, List<Long> teamIds);

    /**
     * get all team id on space.
     *
     * @param spaceId space id
     * @return team ids
     */
    List<Long> getTeamIdsBySpaceId(String spaceId);

    /**
     * batch query team's unitId、teamId、teamName by team's ids.
     *
     * @param spaceId space id
     * @param teamIds team ids
     * @return UnitTeamVo
     */
    List<UnitTeamVo> getUnitTeamVo(String spaceId, List<Long> teamIds);

    /**
     * handle page query member's team info.
     *
     * @param page    page query result
     * @param spaceId space id
     */
    void handlePageMemberTeams(IPage<MemberPageVo> page, String spaceId);

    /**
     * get member's each team's full hierarchy team name.
     *
     * @param memberTeamMap member and team rel map
     * @param spaceId       space id
     * @return map
     */
    Map<Long, List<String>> getMemberEachTeamPathName(Map<Long, List<Long>> memberTeamMap,
                                                      String spaceId);

    /**
     * batch handle team name, get full hierarchy team names and teamId.
     *
     * @param memberIds member ids
     * @param spaceId   space id
     * @return map member's team path names
     */
    Map<Long, List<MemberTeamPathInfo>> batchGetFullHierarchyTeamNames(List<Long> memberIds,
                                                                       String spaceId);

    /**
     * check the team name.
     *
     * @param spaceId  space id
     * @param parentId team parent id
     * @param name     team name
     */
    void checkNameExists(String spaceId, Long parentId, String name);

    /**
     * check the team name.
     *
     * @param spaceId  space id
     * @param parentId team parent id
     * @param teamId   current team id
     * @param name     team name
     */
    void checkNameExists(String spaceId, Long parentId, Long teamId, String name);

    /**
     * get unit team id.
     *
     * @param spaceId space id
     * @param unitId  unit_id
     * @return team id
     */
    Long getTeamIdByUnitId(String spaceId, String unitId, Consumer<Boolean> consumer);

    /**
     * get unit team id.
     *
     * @param spaceId space id
     * @param unitIds unit_id list
     * @return list of team id
     */
    List<Long> getTeamIdsByUnitIds(String spaceId, List<String> unitIds);

    /**
     * get team.
     *
     * @param spaceId space id
     * @param unitId  unit_id
     * @return TeamEntity
     */
    TeamEntity getTeamByUnitId(String spaceId, String unitId);

    /**
     * get member's team name.
     *
     * @param memberIds member and team rel map
     * @return map
     */
    Map<Long, List<String>> getMembersTeamName(List<Long> memberIds);
}
