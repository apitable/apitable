package com.vikadata.api.organization.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.organization.vo.MemberInfoVo;
import com.vikadata.api.organization.vo.MemberPageVo;
import com.vikadata.api.organization.vo.TeamInfoVo;
import com.vikadata.api.organization.vo.TeamTreeVo;
import com.vikadata.api.organization.vo.UnitTeamVo;
import com.vikadata.api.organization.dto.MemberIsolatedInfo;
import com.vikadata.api.organization.vo.MemberTeamPathInfo;
import com.vikadata.api.organization.entity.TeamEntity;

public interface ITeamService extends IService<TeamEntity> {

    /**
     * query the member's team includes all parent team.
     *
     * @param spaceId space id
     * @param memberId member id
     * @return team ids
     */
    Set<Long> getTeamIdsByMemberId(String spaceId, Long memberId);

    /**
     * Check whether the team has members or teams
     *
     * @param spaceId space id
     * @param teamId team id
     * @return true | false
     */
    boolean checkHasSubUnitByTeamId(String spaceId, Long teamId);

    /**
     * check whether members are isolated from contacts
     *
     * @param spaceId space id
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
    int countMemberCountByParentId(Long teamId);

    /**
     * count the teams' members, only count self teams' members.
     *
     * @param teamIds team ids
     * @return the member amount
     */
    int getMemberCount(List<Long> teamIds);

    /**
     * @param teamIds team ids
     * @return the members id
     */
    List<Long> getMemberIdsByTeamIds(List<Long> teamIds);

    /**
     * @param spaceId space id
     * @return root team id
     */
    Long getRootTeamId(String spaceId);

    /**
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
     * @param teamId team id
     * @return parent team's id
     */
    Long getParentId(Long teamId);

    /**
     * get all sub teams id, excluding self.
     *
     * @param teamId team id
     * @return team ids
     */
    List<Long> getAllSubTeamIdsByParentId(Long teamId);

    /**
     *  Get the maximum sorting value of sub team in the team.
     *
     * @param parentId parent team's id
     * @return the sort value
     */
    int getMaxSequenceByParentId(Long parentId);

    /**
     * Create a root team and synchronize the root team with the space name
     *
     * @param spaceId space id
     * @param spaceName space name
     * @return root team id
     */
    Long createRootTeam(String spaceId, String spaceName);

    /**
     * @param spaceId space id
     * @param entities teams
     */
    void batchCreateTeam(String spaceId, List<TeamEntity> entities);

    /**
     * @param spaceId space id
     * @param name    team name
     * @param superId parent team id
     * @return team id
     */
    Long createSubTeam(String spaceId, String name, Long superId);

    /**
     * batch insert team by name
     * !!!Designed for uploading data processing, otherwise use don't use.
     *
     * @param spaceId space id
     * @param rootTeamId root id
     * @param teamNames team names(such as：[level one, level two, level three])
     * @return team ids
     */
    List<Long> createBatchByTeamName(String spaceId, Long rootTeamId, List<String> teamNames);

    /**
     * get the lowest department id in the teamNames
     *
     * @param spaceId space id
     * @param teamNames team path，such as： [A,B,C]
     * @return team id
     */
    Long getByTeamNamePath(String spaceId, List<String> teamNames);

    /**
     * @param spaceId space id
     * @param teamId team id, root team default 0
     * @return TeamInfoVo
     */
    TeamInfoVo getTeamInfoById(String spaceId, Long teamId);

    /**
     * @param teamId team id
     * @param teamName team name
     */
    void updateTeamName(Long teamId, String teamName);

    /**
     * adjust the team hierarchy
     *
     * @param teamId team id
     * @param teamName team name
     * @param parentId parent team id
     */
    void updateTeamParent(Long teamId, String teamName, Long parentId);

    /**
     * @param teamId team id
     */
    void deleteTeam(Long teamId);

    /**
     * @param teamIds team ids
     */
    void deleteTeam(Collection<Long> teamIds);

    /**
     * @param spaceId space id
     * @param teamId team id
     */
    void deleteSubTeam(String spaceId, Long teamId);

    /**
     * Count the number of people in the team in the space. the team's members include sub teams'.
     *
     * @param spaceId space id
     * @param id teamId
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
     * Count the number of people in the team and it's sub team in the space. the team's members include sub teams'.
     *
     * @param teamId team id
     * @return team id - the member amount
     */
    Map<Long, Integer> getTeamMemberCountMap(Long teamId);

    /**
     * @param spaceId space id
     * @return team ids
     */
    List<Long> getTeamIdsBySpaceId(String spaceId);

    /**
     * @param spaceId space id
     * @param teamIds team ids
     * @return TeamTreeVos
     */
    List<TeamTreeVo> getMemberTeamTree(String spaceId, List<Long> teamIds);

    /**
     * @param spaceId space id
     * @param teamIds team ids
     * @return TeamTreeVos
     */
    List<TeamTreeVo> getMemberAllTeamsVO(String spaceId, List<Long> teamIds);

    /**
     * load the member's team tree
     *
     * @param spaceId space id
     * @param memberId member id
     * @return TeamTreeVos
     */
    List<TeamTreeVo> loadMemberTeamTree(String spaceId, Long memberId);


    /**
     * batch query team's unitId、teamId、teamName by team's ids.
     *
     * @param spaceId space id
     * @param teamIds team ids
     * @return UnitTeamVo
     */
    List<UnitTeamVo> getUnitTeamVo(String spaceId, List<Long> teamIds);

    /**
     * handle page query member's team info
     *
     * @param page page query result
     * @param spaceId space id
     */
    void handlePageMemberTeams(IPage<MemberPageVo> page, String spaceId);

    /**
     * handle list member team info
     *
     * @param memberInfoVos member info view
     * @param spaceId space id
     */
    void handleListMemberTeams(List<MemberInfoVo> memberInfoVos, String spaceId);

    /**
     * get member's each team's full hierarchy team name
     *
     * @paarm memberTeamMap member and team rel map
     * @param spaceId space id
     * @return map
     */
    Map<Long, List<String>> getMemberEachTeamPathName(Map<Long, List<Long>> memberTeamMap, String spaceId);

    /**
     * batch handle team name, get full hierarchy team names and teamId
     *
     * @param memberIds member ids
     * @param spaceId space id
     * @return map member's team path names
     */
    Map<Long, List<MemberTeamPathInfo>> batchGetFullHierarchyTeamNames(List<Long> memberIds, String spaceId);
}
