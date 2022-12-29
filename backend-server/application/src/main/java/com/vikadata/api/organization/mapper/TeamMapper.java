package com.vikadata.api.organization.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.organization.dto.TeamMemberDTO;
import com.vikadata.api.organization.vo.MemberPageVo;
import com.vikadata.api.organization.vo.SearchTeamResultVo;
import com.vikadata.api.organization.vo.TeamInfoVo;
import com.vikadata.api.organization.vo.UnitTeamVo;
import com.vikadata.api.organization.dto.TeamBaseInfoDTO;
import com.vikadata.api.organization.dto.TeamCteInfo;
import com.vikadata.api.organization.dto.TeamPathInfo;
import com.vikadata.api.organization.entity.TeamEntity;

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
    List<SearchTeamResultVo> selectByTeamName(@Param("spaceId") String spaceId, @Param("teamName") String teamName);

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
     * Query the sub team of the root team
     *
     * @param spaceId space id
     * @param parentId parent team id
     * @return TeamInfoVo  
     */
    List<TeamInfoVo> selectRootSubTeams(@Param("spaceId") String spaceId, @Param("parentId") Long parentId);

    /**
     * @param spaceId space id
     * @param teamIds team ids
     * @return TeamInfoVos
     */
    List<TeamInfoVo> selectTeamInfoByTeamIds(@Param("spaceId") String spaceId, @Param("teamIds") List<Long> teamIds);

    /**
     * The result does not contain its own
     *
     * @param spaceId space id
     * @param parentId parent team id
     * @return TeamInfoVos
     */
    List<TeamInfoVo> selectSubTeamsByParentId(@Param("spaceId") String spaceId, @Param("parentId") Long parentId);

    /**
     * Query the directly sub team.
     *
     * @param spaceId space id
     * @param parentId parent team id
     * @return sub team ids
     */
    List<Long> selectTeamIdsByParentId(@Param("spaceId") String spaceId, @Param("parentId") Long parentId);

    /**
     * @param teamId team id
     * @param includeSelf   whether contain its own
     * @return parent team ids
     */
    List<Long> selectAllParentTeamIds(@Param("teamId") Long teamId, @Param("includeSelf") boolean includeSelf);

    /**
     * @param parentId parent team id
     * @param includeSelf whether contain its own
     * @return sub team ids
     */
    List<Long> selectAllSubTeamIdsByParentId(@Param("parentId") Long parentId, @Param("includeSelf") boolean includeSelf);

    /**
     * query all team's sub team ids.
     *
     * @param parentIds parent team ids
     * @return all sub team ids
     */
    List<Long> selectAllSubTeamIds(@Param("parentIds") Collection<Long> parentIds);

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
    List<TeamMemberDTO> selectTeamsBySpaceId(@Param("spaceId") String spaceId, @Param("parentId") Long parentId);

    /**
     * @param spaceId space id
     * @param teamIds team ids
     * @return team members
     */
    List<TeamMemberDTO> selectMemberTeamsBySpaceIdAndTeamIds(@Param("spaceId") String spaceId, @Param("teamIds") List<Long> teamIds);

    /**
     * @param spaceId space id
     * @param name     team name
     * @param parentId parent team id
     * @return teams
     */
    TeamEntity selectBySpaceIdAndName(@Param("spaceId") String spaceId, @Param("name") String name, @Param("parentId") Long parentId);

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
     * @param spaceId space id
     * @return TeamEntitys
     */
    List<TeamEntity> selectAllBySpaceId(@Param("spaceId") String spaceId);

    /**
     * fuzzy search team ids by keyword.
     *
     * @param spaceId space id
     * @param likeName keyword
     * @return team ids
     */
    List<Long> selectTeamIdsLikeName(@Param("spaceId") String spaceId, @Param("likeName") String likeName);

    /**
     * fuzzy search team ids by tean=m names.
     *
     * @param spaceId space id
     * @param teamNames team names
     * @return team id
     */
    List<Long> selectIdBySpaceIdAndNames(@Param("spaceId") String spaceId, @Param("list") List<String> teamNames);

    /**
     * @param spaceId space id
     * @param teamId team id
     * @return UnitTeamVos
     */
    UnitTeamVo selectUnitTeamVoByTeamId(@Param("spaceId") String spaceId, @Param("teamId") Long teamId);

    /**
     * @param spaceId space id
     * @param teamIds team ids
     * @return UnitTeamVos
     */
    List<UnitTeamVo> selectUnitTeamVoByTeamIds(@Param("spaceId") String spaceId, @Param("teamIds") List<Long> teamIds);

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
    List<TeamEntity> selectTreeByTeamName(@Param("spaceId") String spaceId, @Param("teamName") String teamName);

    /**
     * Recursively query teams and sub teams
     * @param spaceId space id
     * @param teamIds team ids
     * @return team id
     */
    List<TeamCteInfo> selectChildTreeByTeamIds(@Param("spaceId") String spaceId, @Param("teamIds") List<Long> teamIds);

    /**
     * query team's all parent teams by team's id
     *
     * @param spaceId space id
     * @param teamIds team ids
     * @return team path information
     */
    List<TeamPathInfo> selectParentTreeByTeamIds(@Param("spaceId") String spaceId, @Param("teamIds") List<Long> teamIds);
}
