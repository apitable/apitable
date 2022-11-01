package com.vikadata.api.modular.organization.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Editor;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpTpAuthInfo.Agent;
import me.chanjar.weixin.cp.bean.WxCpTpContactSearchResp;

import com.vikadata.api.cache.service.UserSpaceRemindRecordService;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.config.properties.LimitProperties;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.model.vo.organization.SubUnitResultVo;
import com.vikadata.api.model.vo.organization.UnitInfoVo;
import com.vikadata.api.model.vo.organization.UnitMemberVo;
import com.vikadata.api.model.vo.organization.UnitSearchResultVo;
import com.vikadata.api.model.vo.organization.UnitTeamVo;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.TeamMapper;
import com.vikadata.api.modular.organization.mapper.TeamMemberRelMapper;
import com.vikadata.api.modular.organization.mapper.UnitMapper;
import com.vikadata.api.modular.organization.model.LoadSearchDTO;
import com.vikadata.api.modular.organization.model.TeamCteInfo;
import com.vikadata.api.modular.organization.service.IOrganizationService;
import com.vikadata.api.modular.organization.service.IRoleService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.service.ISocialCpIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.workspace.service.impl.NodeRoleServiceImpl;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.entity.SocialTenantBindEntity;
import com.vikadata.entity.SocialTenantEntity;

import org.springframework.stereotype.Service;

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
    private ISocialTenantService socialTenantService;

    @Resource
    private ISocialTenantBindService socialTenantBindService;

    @Resource
    private ISocialCpIsvService socialCpIsvService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private UserSpaceRemindRecordService userSpaceRemindRecordService;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private IRoleService iRoleService;

    @Resource
    private NodeRoleServiceImpl nodeRoleService;

    @Override
    public UnitSearchResultVo findLikeUnitName(String spaceId, String likeWord, String highlightClassName) {
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
                    team.setTeamName(InformationUtil.keywordHighlight(team.getTeamName(), likeWord, highlightClassName));
                });
                unitSearchResultVo.setTeams(unitTeamVoList);
            }
            //fuzzy search members
            List<Long> memberIds = memberMapper.selectMemberIdsLikeName(spaceId, likeWord);
            if (CollUtil.isNotEmpty(memberIds)) {
                List<UnitMemberVo> unitMemberList = findUnitMemberVo(memberIds);
                unitMemberList.forEach(member -> {
                    member.setOriginName(member.getMemberName());
                    member.setMemberName(InformationUtil.keywordHighlight(member.getMemberName(), likeWord, highlightClassName));
                });

                unitSearchResultVo.setMembers(unitMemberList);
            }

            SocialTenantBindEntity bindEntity = socialTenantBindService.getBySpaceId(spaceId);
            SocialTenantEntity socialTenantEntity = Optional.ofNullable(bindEntity)
                    .map(bind -> {
                        SocialTenantEntity tenantEntity = socialTenantService
                                .getByAppIdAndTenantId(bind.getAppId(), bind.getTenantId());

                        return tenantEntity;
                    })
                    .orElse(null);
            if (Objects.nonNull(socialTenantEntity)
                    && SocialPlatformType.WECOM.getValue().equals(socialTenantEntity.getPlatform())
                    && SocialAppType.ISV.getType() == socialTenantEntity.getAppType()) {
                // If it is the space bound to the wecom, it is necessary to query the qualified users in the wecom contacts.
                String suiteId = socialTenantEntity.getAppId();
                String authCorpId = socialTenantEntity.getTenantId();
                Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
                Integer agentId = agent.getAgentId();
                try {
                    WxCpTpContactSearchResp.QueryResult queryResult = socialCpIsvService.search(suiteId, authCorpId, agentId, likeWord, 1);
                    List<String> cpUserIds = queryResult.getUser().getUserid();
                    if (CollUtil.isNotEmpty(cpUserIds)) {
                        // Populate the returned result with the un-renamed members
                        List<Long> socialMemberIds = memberMapper.selectMemberIdsLikeNameByOpenIds(spaceId, cpUserIds);
                        if (CollUtil.isNotEmpty(socialMemberIds)) {
                            List<UnitMemberVo> unitMemberList = findUnitMemberVo(socialMemberIds);
                            unitMemberList.forEach(member -> {
                                member.setOriginName(member.getMemberName());
                                // Wecom user names need to be front-end rendered, and search results do not return highlighting
                                member.setMemberName(member.getMemberName());
                            });

                            if (Objects.isNull(unitSearchResultVo.getMembers())) {
                                unitSearchResultVo.setMembers(unitMemberList);
                            }
                            else {
                                unitSearchResultVo.getMembers().addAll(unitMemberList);
                            }
                        }
                    }
                }
                catch (WxErrorException ex) {
                    log.error("Failed to search users from wecom isv.", ex);
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
        unitTeam.setMemberCount(iTeamService.countMemberCountByParentId(teamId));
        // query whether there are sub-organizational units（team or member）
        unitTeam.setHasChildren(iTeamService.checkHasSubUnitByTeamId(spaceId, teamId));
        return unitTeam;
    }

    @Override
    public List<UnitTeamVo> findUnitTeamVo(String spaceId, List<Long> teamIds) {
        log.info("query the teams' unit info.");
        List<UnitTeamVo> unitTeamList = teamMapper.selectUnitTeamVoByTeamIds(spaceId, teamIds);
        CollUtil.filter(unitTeamList, (Editor<UnitTeamVo>) unitTeamVo -> {
            // the number of statistics
            int memberCount = iTeamService.countMemberCountByParentId(unitTeamVo.getTeamId());
            unitTeamVo.setMemberCount(memberCount);
            // query whether sub-departments exist
            List<Long> subTeamIds = teamMapper.selectTeamIdsByParentId(spaceId, unitTeamVo.getTeamId());
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
        return memberMapper.selectUnitMemberByMemberIds(memberIds);
    }

    @Override
    public List<UnitMemberVo> findAdminsVo(List<Long> memberIds, String spaceId) {
        if (CollUtil.isEmpty(memberIds)) {
            return new ArrayList<>();
        }
        List<UnitMemberVo> unitMemberVos = memberMapper.selectUnitMemberByMemberIds(memberIds);
        // handle member's team name, get full hierarchy team name
        nodeRoleService.handleNodeMemberTeamName(unitMemberVos, spaceId);
        return unitMemberVos;
    }

    @Override
    public List<UnitInfoVo> loadOrSearchInfo(Long userId, String spaceId, LoadSearchDTO params, Long sharer) {
        log.info("load or search unit");
        List<Long> unitIds = this.getLoadedUnitIds(userId, spaceId, params, sharer);
        // Specifies the ID of the organizational unit to filter
        if (CollUtil.isNotEmpty(params.getFilterIds())) {
            unitIds.removeAll(params.getFilterIds());
        }
        if (CollUtil.isNotEmpty(unitIds)) {
            return iUnitService.getUnitInfoList(spaceId, unitIds);
        }
        return new ArrayList<>();
    }

    private List<Long> getLoadedUnitIds(Long userId, String spaceId, LoadSearchDTO params, Long sharer) {
        if (CollUtil.isNotEmpty(params.getUnitIds())) {
            return params.getUnitIds();
        }
        if (BooleanUtil.isTrue(params.getAll())) {
            return unitMapper.selectIdBySpaceId(spaceId);
        }
        List<Long> unitIds = new ArrayList<>();
        List<Long> refIds = new ArrayList<>();
        String likeWord = CharSequenceUtil.trim(params.getKeyword());
        if (CharSequenceUtil.isNotBlank(likeWord)) {
            refIds = this.getSearchUnitRefIds(spaceId, likeWord, params.getSearchEmail());
        }
        else {
            if (sharer != null) {
                // a sharer of node sharing
                refIds.add(sharer);
            }
            else if (userId != null) {
                // Load the most recently selected members and departments
                unitIds = userSpaceRemindRecordService.getRemindUnitIds(userId, spaceId);
                Integer loadCount = limitProperties.getMemberFieldMaxLoadCount();
                if (CollUtil.isEmpty(unitIds) || unitIds.size() < loadCount) {
                    // Gets the group members of the latest group that the member joined
                    Long memberId = userSpaceService.getMemberId(userId, spaceId);
                    List<Long> teamIds = teamMemberRelMapper.selectTeamIdsByMemberId(memberId);
                    if (CollUtil.isNotEmpty(teamIds)) {
                        List<Long> ids = teamMemberRelMapper.selectMemberIdsByTeamId(teamIds.get(teamIds.size() - 1));
                        refIds = CollUtil.sub(CollUtil.reverse(ids), 0, loadCount - unitIds.size());
                    }
                }
            }
        }
        if (CollUtil.isNotEmpty(refIds)) {
            List<Long> ids = unitMapper.selectIdsByRefIds(refIds);
            CollUtil.addAllIfNotContains(unitIds, ids);
        }
        return unitIds;
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

        // social wecom logic
        SocialTenantEntity socialTenantEntity = Optional.ofNullable(socialTenantBindService.getBySpaceId(spaceId))
                .map(bind -> socialTenantService.getByAppIdAndTenantId(bind.getAppId(), bind.getTenantId()))
                .orElse(null);
        if (Objects.nonNull(socialTenantEntity)
                && SocialPlatformType.WECOM.getValue().equals(socialTenantEntity.getPlatform())
                && SocialAppType.ISV.getType() == socialTenantEntity.getAppType()) {
            // If it is the space bound to the wecom, it is necessary to query the qualified users in the wecom contacts.
            String suiteId = socialTenantEntity.getAppId();
            String authCorpId = socialTenantEntity.getTenantId();
            Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
            Integer agentId = agent.getAgentId();
            try {
                WxCpTpContactSearchResp.QueryResult queryResult = socialCpIsvService.search(suiteId, authCorpId, agentId, likeWord, 1);
                List<String> cpUserIds = queryResult.getUser().getUserid();
                if (CollUtil.isNotEmpty(cpUserIds)) {
                    // Populate the returned result with the un-renamed members
                    List<Long> socialMemberIds = memberMapper.selectMemberIdsLikeNameByOpenIds(spaceId, cpUserIds);
                    refIds.addAll(socialMemberIds);
                }
            }
            catch (WxErrorException ex) {
                log.error("Failed to search users from wecom isv.", ex);
            }
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
        log.info("Load the first department of the organization tree to which a member belongs");
        List<Long> loadTeamIds = this.loadMemberFirstTeamIds(spaceId, teamIds);
        // get the required load department UnitTeamVo
        List<UnitTeamVo> unitTeamVoList = this.findUnitTeamVo(spaceId, loadTeamIds);
        SubUnitResultVo subUnitResultVo = new SubUnitResultVo();
        subUnitResultVo.setTeams(unitTeamVoList);
        return subUnitResultVo;
    }

    @Override
    public List<Long> loadMemberFirstTeamIds(String spaceId, List<Long> teamIds) {
        log.info("Load the first department id of the organization tree to which a member belongs");
        // Member's department's and all sub-departments' id and parentId
        List<TeamCteInfo> teamsInfo = teamMapper.selectChildTreeByTeamIds(spaceId, teamIds);
        // the member's team and all sub-teams' id
        List<Long> teamIdList = teamsInfo.stream().map(TeamCteInfo::getId).collect(Collectors.toList());
        // Filter out the departments that do not need to be loaded
        return teamsInfo.stream()
                .filter(teamInfo -> !teamIdList.contains(teamInfo.getParentId()))
                .map(TeamCteInfo::getId).collect(Collectors.toList());
    }
}
