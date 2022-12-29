package com.vikadata.api.organization.service;

import java.util.List;

import com.vikadata.api.organization.vo.SubUnitResultVo;
import com.vikadata.api.organization.vo.UnitInfoVo;
import com.vikadata.api.organization.vo.UnitMemberVo;
import com.vikadata.api.organization.vo.UnitSearchResultVo;
import com.vikadata.api.organization.vo.UnitTeamVo;
import com.vikadata.api.organization.dto.LoadSearchDTO;

public interface IOrganizationService {

    /**
     * search unit.
     *
     * @param spaceId space id
     * @param likeWord key wrod
     * @param highlightClassName the highlighted style
     * @return UnitSearchResultVo
     */
    UnitSearchResultVo findLikeUnitName(String spaceId, String likeWord, String highlightClassName);

    /**
     * query units in the the team.
     *
     * @param spaceId space id
     * @param teamId team id
     * @return SubUnitResultVo
     */
    SubUnitResultVo findSubUnit(String spaceId, Long teamId);

    /**
     * query the team's unit info.
     *
     * @param spaceId space id
     * @param teamId team id
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

    UnitMemberVo finUnitMemberVo(Long memberId);

    /**
     * query the members' unit info.
     *
     * @param memberIds member ids
     * @return UnitMemberVo List
     */
    List<UnitMemberVo> findUnitMemberVo(List<Long> memberIds);

    /**
     * query admins information
     *
     * @param memberIds member ids
     * @param spaceId space id
     * @return admins information
     */
    List<UnitMemberVo> findAdminsVo(List<Long> memberIds, String spaceId);

    /**
     * load or search unit
     *
     * @param userId    user id
     * @param spaceId space id
     * @param params  search key
     * @return UnitInfoVo
     */
    List<UnitInfoVo> loadOrSearchInfo(Long userId, String spaceId, LoadSearchDTO params, Long sharer);

    /**
     * accurate search
     *
     * @param spaceId space id
     * @param names   unit names
     * @return UnitInfoVo
     */
    List<UnitInfoVo> accurateSearch(String spaceId, List<String> names);

    /**
     * Load the first department of the organization tree to which a member belongs
     *
     * @param spaceId space id
     * @param teamIds team ids
     * @return SubUnitResultVo
     */
    SubUnitResultVo loadMemberFirstTeams(String spaceId, List<Long> teamIds);

    /**
     * Load the first department id of the organization tree to which a member belongs
     *
     * @param spaceId space id
     * @param teamIds team ids
     * @return teamIds
     */
    List<Long> loadMemberFirstTeamIds(String spaceId, List<Long> teamIds);
}
