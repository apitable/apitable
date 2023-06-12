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

package com.apitable.organization.mapper;

import com.apitable.organization.dto.TeamBaseInfoDTO;
import com.apitable.organization.dto.TeamCteInfo;
import com.apitable.organization.dto.TeamMemberDTO;
import com.apitable.organization.dto.TeamPathInfo;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.vo.MemberPageVo;
import com.apitable.organization.vo.SearchTeamResultVo;
import com.apitable.organization.vo.TeamTreeVo;
import com.apitable.organization.vo.UnitTeamVo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface TeamMapper extends BaseMapper<TeamEntity> {

    /**
     * @param spaceId space id
     * @return root team id
     */
    Long selectRootIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * @param teamId team id
     * @return parent id
     */
    Long selectParentIdByTeamId(@Param("teamId") Long teamId);

    /**
     * Fuzzy query a team based on the team name
     *
     * @param spaceId space id
     * @param teamName team name
     * @return search result
     */
    List<SearchTeamResultVo> selectByTeamName(@Param("spaceId") String spaceId,
        @Param("teamName") String teamName);

    /**
     * query whether sub departments exist
     *
     * @param parentId parent team id
     * @return row amount
     */
    Integer existChildrenByParentId(@Param("parentId") Long parentId);

    /**
     * Query the maximum sorting value of sub team in the department.
     *
     * @param parentId parent team id
     * @return the maximum sorting
     */
    Integer selectMaxSequenceByParentId(@Param("parentId") Long parentId);

    /**
     * Query team ids
     *
     * @param parentIds parentIds
     * @return TeamIds
     * @author Chambers
     */
    List<Long> selectTeamIdByParentIdIn(@Param("parentIds") Collection<Long> parentIds);

    /**
     * Query team tree view
     *
     * @param teamIds teamIds
     * @return List<TeamTreeVo>
     * @author Chambers
     */
    List<TeamTreeVo> selectTeamTreeVoByTeamIdIn(@Param("teamIds") Collection<Long> teamIds);

    /**
     * Query team tree view
     *
     * @param parentIds parentIds
     * @return List<TeamTreeVo>
     * @author Chambers
     */
    List<TeamTreeVo> selectTeamTreeVoByParentIdIn(@Param("parentIds") Collection<Long> parentIds);

    /**
     * Query the directly sub team.
     *
     * @param spaceId space id
     * @param parentId parent team id
     * @return sub team ids
     */
    List<Long> selectTeamIdsByParentId(@Param("spaceId") String spaceId,
        @Param("parentId") Long parentId);

    /**
     * @param teamId team id
     * @param includeSelf   whether contain its own
     * @return parent team ids
     */
    List<Long> selectAllParentTeamIds(@Param("teamId") Long teamId,
        @Param("includeSelf") boolean includeSelf);

    /**
     * query root team's members
     *
     * @param spaceId space id
     * @return members info
     */
    List<MemberPageVo> selectMembersByRootTeamId(@Param("spaceId") String spaceId);

    /**
     * Page query root team's members
     *
     * @param page    page object
     * @param spaceId space id
     * @param isActive filter the added or unadded members. null is all.
     * @return page
     */
    IPage<MemberPageVo> selectMembersByRootTeamId(Page<MemberPageVo> page,
        @Param("spaceId") String spaceId, @Param("isActive") Integer isActive);

    /**
     * @param teamIds team ids
     * @return member
     */
    List<MemberPageVo> selectMembersByTeamId(@Param("teamIds") List<Long> teamIds);

    /**
     * Page query teams' members. filter the added or unadded members. null is all.
     *
     * @param page    page object
     * @param teamIds team ids
     * @param isActive filter the added or unadded members. null is all.
     * @return page result
     */
    IPage<MemberPageVo> selectMemberPageByTeamId(Page<MemberPageVo> page,
        @Param("teamIds") List<Long> teamIds, @Param("isActive") Integer isActive);

    /**
     * @param spaceId space id
     * @return teams
     */
    List<TeamMemberDTO> selectTeamsBySpaceId(@Param("spaceId") String spaceId,
        @Param("parentId") Long parentId);

    /**
     * @param spaceId space id
     * @param teamIds team ids
     * @return team members
     */
    List<TeamMemberDTO> selectMemberTeamsBySpaceIdAndTeamIds(@Param("spaceId") String spaceId,
        @Param("teamIds") List<Long> teamIds);

    /**
     * @param spaceId space id
     * @param name     team name
     * @param parentId parent team id
     * @return teams
     */
    TeamEntity selectBySpaceIdAndName(@Param("spaceId") String spaceId, @Param("name") String name,
        @Param("parentId") Long parentId);

    /**
     * @param teamIds team ids
     * @return TeamMemberDtos
     */
    List<TeamMemberDTO> selectTeamsByIds(@Param("teamIds") List<Long> teamIds);

    /**
     * @param teamIds team ids
     * @return TeamEntities
     */
    List<TeamEntity> selectByTeamIdsIgnoreDelete(@Param("teamIds") Collection<Long> teamIds);

    /**
     * fuzzy search team ids by keyword.
     *
     * @param spaceId space id
     * @param likeName keyword
     * @return team ids
     */
    List<Long> selectTeamIdsLikeName(@Param("spaceId") String spaceId,
        @Param("likeName") String likeName);

    /**
     * fuzzy search team ids by tean=m names.
     *
     * @param spaceId space id
     * @param teamNames team names
     * @return team id
     */
    List<Long> selectIdBySpaceIdAndNames(@Param("spaceId") String spaceId,
        @Param("list") List<String> teamNames);

    /**
     * @param spaceId space id
     * @param teamId team id
     * @return UnitTeamVos
     */
    UnitTeamVo selectUnitTeamVoByTeamId(@Param("spaceId") String spaceId,
        @Param("teamId") Long teamId);

    /**
     * @param spaceId space id
     * @param teamIds team ids
     * @return UnitTeamVos
     */
    List<UnitTeamVo> selectUnitTeamVoByTeamIds(@Param("spaceId") String spaceId,
        @Param("teamIds") List<Long> teamIds);

    /**
     * @param teamId team id
     * @return space id
     */
    String selectSpaceIdById(@Param("teamId") Long teamId);

    /**
     * @param teamId team id
     * @return Team Name
     */
    String selectTeamNameById(@Param("teamId") Long teamId);

    /**
     * @param teamIds team ids
     * @return TeamBaseInfoDTO List
     */
    List<TeamBaseInfoDTO> selectBaseInfoDTOByIds(@Param("teamIds") Collection<Long> teamIds);

    /**
     * @param teamId team id
     * @return the member count
     */
    Integer selectMemberCountByTeamId(@Param("teamId") Long teamId);

    /**
     * @param teamId team id
     * @return the active member count
     * */
    Integer selectActiveMemberCountByTeamId(@Param("teamId") Long teamId);

    /**
     * @param spaceId space id
     * @return team ids
     */
    List<Long> selectTeamAllIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * query all parent team by teams name
     *
     * @param spaceId space id
     * @param teamName team name
     * @return teams
     */
    List<TeamEntity> selectTreeByTeamName(@Param("spaceId") String spaceId,
        @Param("teamName") String teamName);

    /**
     * Recursively query teams and sub teams
     *
     * @param spaceId space id
     * @param teamIds team ids
     * @return team id
     */
    List<TeamCteInfo> selectChildTreeByTeamIds(@Param("spaceId") String spaceId,
                                               @Param("teamIds") List<Long> teamIds);

    /**
     * query team's all parent teams by team's id
     *
     * @param spaceId space id
     * @param teamIds team ids
     * @return team path information
     */
    List<TeamPathInfo> selectParentTreeByTeamIds(@Param("spaceId") String spaceId,
                                                 @Param("teamIds") List<Long> teamIds);

    /**
     * Query page of the directly sub team Id.
     *
     * @param spaceId  space id
     * @param parentId parent team id
     * @return page of sub team ids
     */
    IPage<Long> selectTeamIdsBySpaceIdAndParentIdAndPage(Page<Long> page,
                                                         @Param("spaceId") String spaceId,
                                                         @Param("parentId") Long parentId);

    /**
     * count rows by team's name.
     *
     * @param spaceId  the space's id
     * @param parentId the team parent id
     * @param teamId   the current team's id
     * @param teamName the team's name
     * @return number of rows
     */
    Integer selectCountByParentIdAndSpaceIdAndTeamNameWithExceptId(
        @Param("parentId") Long parentId,
        @Param("spaceId") String spaceId,
        @Param("teamId") Long teamId,
        @Param("teamName") String teamName
    );

    /**
     * count rows by team's name.
     *
     * @param spaceId  the space's id
     * @param parentId the team parent id
     * @param teamName the team's name
     * @return number of rows
     */
    Integer selectCountByParentIdAndSpaceIdAndTeamName(
        @Param("parentId") Long parentId,
        @Param("spaceId") String spaceId,
        @Param("teamName") String teamName
    );

}
