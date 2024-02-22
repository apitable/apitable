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

package com.apitable.organization.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.BooleanUtil;
import com.apitable.interfaces.social.facade.SocialServiceFacade;
import com.apitable.organization.dto.LoadSearchDTO;
import com.apitable.organization.dto.TeamCteInfo;
import com.apitable.organization.facade.TeamFacade;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.mapper.TeamMemberRelMapper;
import com.apitable.organization.mapper.UnitMapper;
import com.apitable.organization.service.IOrganizationService;
import com.apitable.organization.service.IRoleService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.vo.SubUnitResultVo;
import com.apitable.organization.vo.UnitInfoVo;
import com.apitable.organization.vo.UnitMemberVo;
import com.apitable.organization.vo.UnitSearchResultVo;
import com.apitable.organization.vo.UnitTeamVo;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.cache.service.UserSpaceRemindRecordCacheService;
import com.apitable.shared.config.properties.LimitProperties;
import com.apitable.shared.util.DBUtil;
import com.apitable.shared.util.information.InformationUtil;
import com.apitable.workspace.service.INodeRoleService;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Organization Service Implements.
 *
 * @author shawndeng
 */
@Slf4j
@Service
public class OrganizationServiceImpl implements IOrganizationService {

    @Resource
    private UnitMapper unitMapper;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private TeamFacade teamFacade;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    @Resource
    private UserSpaceRemindRecordCacheService userSpaceRemindRecordCacheService;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private IRoleService iRoleService;

    @Resource
    private INodeRoleService nodeRoleService;

    @Resource
    private SocialServiceFacade socialServiceFacade;

    @Override
    public UnitSearchResultVo findLikeUnitName(String spaceId, String likeWord,
                                               String highlightClassName) {
        log.info("search organizational unit");
        UnitSearchResultVo unitSearchResultVo = new UnitSearchResultVo();
        String all = "*";
        if (CharSequenceUtil.isNotBlank(likeWord) && !CharSequenceUtil.equals(likeWord, all)) {
            // fuzzy search department
            List<Long> teamIds = teamMapper.selectTeamIdsLikeName(spaceId, likeWord);
            if (CollUtil.isNotEmpty(teamIds)) {
                List<UnitTeamVo> unitTeamVoList = this.findUnitTeamVo(spaceId, teamIds);
                unitTeamVoList.forEach(team -> {
                    team.setOriginName(team.getTeamName());
                    team.setTeamName(
                        InformationUtil.keywordHighlight(team.getTeamName(), likeWord,
                            highlightClassName));
                });
                unitSearchResultVo.setTeams(unitTeamVoList);
            }
            // fuzzy search members
            List<Long> memberIds = memberMapper.selectMemberIdsLikeName(spaceId, likeWord);
            if (CollUtil.isNotEmpty(memberIds)) {
                List<UnitMemberVo> unitMemberList = findUnitMemberVo(memberIds);
                // handle member's team name，get full hierarchy team name
                Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap =
                    iTeamService.batchGetFullHierarchyTeamNames(memberIds, spaceId);
                unitMemberList.forEach(member -> {
                    if (memberToTeamPathInfoMap.containsKey(member.getMemberId())) {
                        member.setTeamData(memberToTeamPathInfoMap.get(member.getMemberId()));
                    }
                    member.setOriginName(member.getMemberName());
                    member.setMemberName(
                        InformationUtil.keywordHighlight(member.getMemberName(), likeWord,
                            highlightClassName));
                });

                unitSearchResultVo.setMembers(unitMemberList);
            }

            List<String> openIds =
                socialServiceFacade.fuzzySearchIfSatisfyCondition(spaceId, likeWord);
            if (CollUtil.isNotEmpty(openIds)) {
                // Populate the returned result with the un-renamed members
                List<Long> socialMemberIds =
                    memberMapper.selectMemberIdsLikeNameByOpenIds(spaceId, openIds);
                if (CollUtil.isNotEmpty(socialMemberIds)) {
                    List<UnitMemberVo> unitMemberList = findUnitMemberVo(socialMemberIds);
                    // handle member's team name，get full hierarchy team name
                    Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap =
                        iTeamService.batchGetFullHierarchyTeamNames(memberIds, spaceId);
                    unitMemberList.forEach(member -> {
                        if (memberToTeamPathInfoMap.containsKey(member.getMemberId())) {
                            member.setTeamData(memberToTeamPathInfoMap.get(member.getMemberId()));
                        }
                        member.setOriginName(member.getMemberName());
                        // Wecom usernames need to be front-end rendered,
                        // and search results do not return highlighting
                        member.setMemberName(member.getMemberName());
                    });

                    if (Objects.isNull(unitSearchResultVo.getMembers())) {
                        unitSearchResultVo.setMembers(unitMemberList);
                    } else {
                        unitSearchResultVo.getMembers().addAll(unitMemberList);
                    }
                }
            }
        }
        return unitSearchResultVo;
    }

    @Override
    public SubUnitResultVo findSubUnit(String spaceId, Long teamId) {
        log.info("query units in the team.");
        SubUnitResultVo subUnitResultVo = new SubUnitResultVo();
        // obtain a list of directly subordinate departments
        List<Long> subTeamIds = teamMapper.selectTeamIdsByParentId(spaceId, teamId);
        // obtain the list of sub departments
        if (CollUtil.isNotEmpty(subTeamIds)) {
            List<UnitTeamVo> unitTeamVoList = this.findUnitTeamVo(spaceId, subTeamIds);
            subUnitResultVo.setTeams(unitTeamVoList);
        }
        // getting a member list
        if (teamId != null && teamId != 0) {
            List<Long> memberIds = teamMemberRelMapper.selectMemberIdsByTeamId(teamId);
            if (CollUtil.isNotEmpty(memberIds)) {
                List<UnitMemberVo> unitMemberVoList = this.findUnitMemberVo(memberIds);
                subUnitResultVo.setMembers(unitMemberVoList);
            }
        }
        return subUnitResultVo;
    }

    @Override
    public UnitTeamVo findUnitTeamVo(String spaceId, Long teamId) {
        log.info("query the team's unit info.");
        UnitTeamVo unitTeam = teamMapper.selectUnitTeamVoByTeamId(spaceId, teamId);
        // the number of statistics
        unitTeam.setMemberCount(
            SqlHelper.retCount(iTeamService.countMemberCountByParentId(teamId)));
        // query whether there are sub-organizational units（team or member）
        unitTeam.setHasChildren(iTeamService.checkHasSubUnitByTeamId(spaceId, teamId));
        return unitTeam;
    }

    @Override
    public List<UnitTeamVo> findUnitTeamVo(String spaceId, List<Long> teamIds) {
        log.info("query the teams' unit info.");
        List<UnitTeamVo> unitTeamList = iTeamService.getUnitTeamVo(spaceId, teamIds);
        CollUtil.edit(unitTeamList, unitTeamVo -> {
            // the number of statistics
            long memberCount = iTeamService.countMemberCountByParentId(unitTeamVo.getTeamId());
            unitTeamVo.setMemberCount(memberCount);
            // query whether sub-departments exist
            List<Long> subTeamIds =
                teamMapper.selectTeamIdsByParentId(spaceId, unitTeamVo.getTeamId());
            if (CollUtil.isNotEmpty(subTeamIds)) {
                unitTeamVo.setHasChildren(true);
                unitTeamVo.setHasChildrenTeam(true);
                return unitTeamVo;
            }
            // query whether the department has members
            unitTeamVo.setHasChildren(memberCount > 0);
            return unitTeamVo;
        });
        return unitTeamList;
    }

    @Override
    public UnitMemberVo finUnitMemberVo(Long memberId) {
        return memberMapper.selectUnitMemberByMemberId(memberId);
    }

    @Override
    public List<UnitMemberVo> findUnitMemberVo(List<Long> memberIds) {
        log.info("query the members' unit info.");
        if (CollUtil.isEmpty(memberIds)) {
            return new ArrayList<>();
        }
        return DBUtil.batchSelectByFieldIn(memberIds, memberMapper::selectUnitMemberByMemberIds);
    }

    @Override
    public List<UnitMemberVo> findAdminsVo(List<Long> memberIds, String spaceId) {
        if (CollUtil.isEmpty(memberIds)) {
            return new ArrayList<>();
        }
        List<UnitMemberVo> unitMemberVos = this.findUnitMemberVo(memberIds);
        // handle member's team name, get full hierarchy team name
        nodeRoleService.handleNodeMemberTeamName(unitMemberVos, spaceId);
        return unitMemberVos;
    }

    @Override
    public List<UnitInfoVo> loadOrSearchInfo(Long userId, String spaceId, LoadSearchDTO params,
                                             Long sharer) {
        log.info("load or search unit");
        List<Long> unitIds = this.getLoadedUnitIds(userId, spaceId, params, sharer);
        if (CollUtil.isEmpty(unitIds)) {
            return new ArrayList<>();
        }
        // Specifies the ID of the organizational unit to filter
        if (CollUtil.isNotEmpty(params.getFilterIds())) {
            unitIds.removeAll(params.getFilterIds());
        }
        return iUnitService.getUnitInfoList(spaceId, unitIds);
    }

    private List<Long> getLoadedUnitIds(Long userId, String spaceId, LoadSearchDTO params,
                                        Long sharer) {
        if (CollUtil.isNotEmpty(params.getUnitIds())) {
            return params.getUnitIds();
        }
        if (BooleanUtil.isTrue(params.getAll())) {
            return unitMapper.selectIdBySpaceId(spaceId);
        }
        String likeWord = CharSequenceUtil.trim(params.getKeyword());
        if (CharSequenceUtil.isNotBlank(likeWord)) {
            List<Long> refIds =
                this.getSearchUnitRefIds(spaceId, likeWord, params.getSearchEmail());
            if (refIds.isEmpty()) {
                return new ArrayList<>();
            }
            return unitMapper.selectIdsByRefIds(refIds);
        }
        if (sharer != null) {
            // a sharer of node sharing
            return unitMapper.selectIdsByRefIds(Collections.singletonList(sharer));
        }
        if (userId == null) {
            return new ArrayList<>();
        }
        // Load the most recently selected members and departments
        List<Long> unitIds = userSpaceRemindRecordCacheService.getRemindUnitIds(userId, spaceId);
        if (CollUtil.isNotEmpty(unitIds)) {
            return unitIds;
        }
        Integer loadCount = limitProperties.getMemberFieldMaxLoadCount();
        // Gets the group members of the latest group that the member joined
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        List<Long> teamIds = teamMemberRelMapper.selectTeamIdsByMemberId(memberId);
        if (CollUtil.isEmpty(teamIds)) {
            return new ArrayList<>();
        }
        Long lastTeamId = teamIds.get(teamIds.size() - 1);
        List<Long> memberIds = teamMemberRelMapper.selectMemberIdsByTeamId(lastTeamId);
        if (CollUtil.isEmpty(memberIds)) {
            return new ArrayList<>();
        }
        List<Long> refIds = CollUtil.sub(CollUtil.reverse(memberIds), 0, loadCount);
        List<Long> unitPrimaryIds = unitMapper.selectIdsByRefIds(refIds);
        userSpaceRemindRecordCacheService.refresh(userId, spaceId, unitPrimaryIds);
        return unitPrimaryIds;
    }

    private List<Long> getSearchUnitRefIds(String spaceId, String likeWord, Boolean searchEmail) {
        // fuzzy search department
        List<Long> teamIds = teamMapper.selectTeamIdsLikeName(spaceId, likeWord);
        List<Long> refIds = new ArrayList<>(teamIds);
        // fuzzy search members
        List<Long> memberIds = memberMapper.selectMemberIdsLikeName(spaceId, likeWord);
        refIds.addAll(memberIds);
        // fuzzy search email
        if (BooleanUtil.isTrue(searchEmail)) {
            refIds.addAll(memberMapper.selectIdsBySpaceIdAndEmailKeyword(spaceId, likeWord));
        }
        // fuzzy search role
        List<Long> roleIds = iRoleService.getRoleIdsByKeyWord(spaceId, likeWord);
        refIds.addAll(roleIds);

        List<String> openIds = socialServiceFacade.fuzzySearchIfSatisfyCondition(spaceId, likeWord);
        if (CollUtil.isNotEmpty(openIds)) {
            // Populate the returned result with the un-renamed members
            List<Long> socialMemberIds =
                memberMapper.selectMemberIdsLikeNameByOpenIds(spaceId, openIds);
            refIds.addAll(socialMemberIds);
        }
        return refIds;
    }

    @Override
    public List<UnitInfoVo> accurateSearch(String spaceId, List<String> names) {
        log.info("accurate search unit by spaceId:{} and names:{}", spaceId, names);
        if (CollUtil.isEmpty(names)) {
            return new ArrayList<>();
        }
        // search team
        List<Long> refIds = teamMapper.selectIdBySpaceIdAndNames(spaceId, names);
        // search member
        List<Long> memberIds = memberMapper.selectIdBySpaceIdAndNames(spaceId, names);
        refIds.addAll(memberIds);
        if (CollUtil.isEmpty(refIds)) {
            return new ArrayList<>();
        }
        List<Long> unitIds = unitMapper.selectIdsByRefIds(refIds);
        if (CollUtil.isEmpty(unitIds)) {
            return new ArrayList<>();
        }
        return iUnitService.getUnitInfoList(spaceId, unitIds);
    }

    @Override
    public SubUnitResultVo loadMemberFirstTeams(String spaceId, List<Long> teamIds) {
        List<Long> loadTeamIds = this.loadMemberFirstTeamIds(teamIds);
        // get the required load department UnitTeamVo
        List<UnitTeamVo> unitTeamVoList = this.findUnitTeamVo(spaceId, loadTeamIds);
        SubUnitResultVo subUnitResultVo = new SubUnitResultVo();
        subUnitResultVo.setTeams(unitTeamVoList);
        return subUnitResultVo;
    }

    @Override
    public List<Long> loadMemberFirstTeamIds(List<Long> teamIds) {
        // Member's department's and all sub-departments' id and parentId
        List<TeamCteInfo> teamsInfo = teamFacade.getAllChildTeam(teamIds);
        // the member's team and all child teams id
        List<Long> teamIdList =
            teamsInfo.stream().map(TeamCteInfo::getId).toList();
        // Filter out the departments that do not need to be loaded
        return teamsInfo.stream()
            .filter(teamInfo -> !teamIdList.contains(teamInfo.getParentId()))
            .map(TeamCteInfo::getId).collect(Collectors.toList());
    }
}
