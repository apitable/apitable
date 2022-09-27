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

/**
 * <p>
 * 组织单元 服务接口实现
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/1/10 14:20
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
        log.info("搜索组织单元");
        UnitSearchResultVo unitSearchResultVo = new UnitSearchResultVo();
        String all = "*";
        if (CharSequenceUtil.isNotBlank(likeWord) && !CharSequenceUtil.equals(likeWord, all)) {
            //模糊搜索部门
            List<Long> teamIds = teamMapper.selectTeamIdsLikeName(spaceId, likeWord);
            if (CollUtil.isNotEmpty(teamIds)) {
                List<UnitTeamVo> unitTeamVoList = this.findUnitTeamVo(spaceId, teamIds);
                unitTeamVoList.forEach(team -> {
                    team.setOriginName(team.getTeamName());
                    team.setTeamName(InformationUtil.keywordHighlight(team.getTeamName(), likeWord, highlightClassName));
                });
                unitSearchResultVo.setTeams(unitTeamVoList);
            }
            //模糊搜索成员
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
                // 如果是企业微信服务商绑定的空间站，需要查询企微通讯录中符合条件的用户
                String suiteId = socialTenantEntity.getAppId();
                String authCorpId = socialTenantEntity.getTenantId();
                Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
                Integer agentId = agent.getAgentId();
                try {
                    WxCpTpContactSearchResp.QueryResult queryResult = socialCpIsvService.search(suiteId, authCorpId, agentId, likeWord, 1);
                    List<String> cpUserIds = queryResult.getUser().getUserid();
                    if (CollUtil.isNotEmpty(cpUserIds)) {
                        // 将其中未改名的成员填充至返回结果
                        List<Long> socialMemberIds = memberMapper.selectMemberIdsLikeNameByOpenIds(spaceId, cpUserIds);
                        if (CollUtil.isNotEmpty(socialMemberIds)) {
                            List<UnitMemberVo> unitMemberList = findUnitMemberVo(socialMemberIds);
                            unitMemberList.forEach(member -> {
                                member.setOriginName(member.getMemberName());
                                // 企微用户名称需要前端渲染，搜索结果不返回高亮
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
        log.info("查询部门下的组织单元资源");
        SubUnitResultVo subUnitResultVo = new SubUnitResultVo();
        //获取直属子部门列表
        List<Long> subTeamIds = teamMapper.selectTeamIdsByParentId(spaceId, teamId);
        //获取子部门列表
        if (CollUtil.isNotEmpty(subTeamIds)) {
            List<UnitTeamVo> unitTeamVoList = this.findUnitTeamVo(spaceId, subTeamIds);
            subUnitResultVo.setTeams(unitTeamVoList);
        }
        //获取成员列表
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
        log.info("获取部门组织单元视图列表");
        UnitTeamVo unitTeam = teamMapper.selectUnitTeamVoByTeamId(spaceId, teamId);
        //统计人数
        unitTeam.setMemberCount(iTeamService.countMemberCountByParentId(teamId));
        //查询是否有子组织单元（部门或成员）
        unitTeam.setHasChildren(iTeamService.checkHasSubUnitByTeamId(spaceId, teamId));
        return unitTeam;
    }

    @Override
    public List<UnitTeamVo> findUnitTeamVo(String spaceId, List<Long> teamIds) {
        log.info("批量获取部门组织单元视图列表");
        List<UnitTeamVo> unitTeamList = teamMapper.selectUnitTeamVoByTeamIds(spaceId, teamIds);
        CollUtil.filter(unitTeamList, (Editor<UnitTeamVo>) unitTeamVo -> {
            //统计人数
            int memberCount = iTeamService.countMemberCountByParentId(unitTeamVo.getTeamId());
            unitTeamVo.setMemberCount(memberCount);
            // 查询是否有子部门
            List<Long> subTeamIds = teamMapper.selectTeamIdsByParentId(spaceId, unitTeamVo.getTeamId());
            if (CollUtil.isNotEmpty(subTeamIds)) {
                unitTeamVo.setHasChildren(true);
                unitTeamVo.setHasChildrenTeam(true);
                return unitTeamVo;
            }
            // 查询部门是否有成员
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
        log.info("批量获取成员组织单元视图列表");
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
        List<UnitMemberVo> unitMemberVos =  memberMapper.selectUnitMemberByMemberIds(memberIds);
        // handle member's team name, get full hierarchy team name
        nodeRoleService.handleNodeMemberTeamName(unitMemberVos, spaceId);
        return unitMemberVos;
    }

    @Override
    public List<UnitInfoVo> loadOrSearchInfo(Long userId, String spaceId, LoadSearchDTO params, Long sharer) {
        log.info("加载/搜索 组织单元信息视图");
        List<Long> unitIds = new ArrayList<>();
        if (CollUtil.isEmpty(params.getUnitIds())) {
            if (BooleanUtil.isTrue(params.getAll())) {
                unitIds = unitMapper.selectIdBySpaceId(spaceId);
            }
            else {
                List<Long> refIds = new ArrayList<>();
                String likeWord = CharSequenceUtil.trim(params.getKeyword());
                if (CharSequenceUtil.isNotBlank(likeWord)) {
                    // 模糊搜索部门
                    List<Long> teamIds = teamMapper.selectTeamIdsLikeName(spaceId, likeWord);
                    refIds.addAll(teamIds);
                    // 模糊搜索成员
                    List<Long> memberIds = memberMapper.selectMemberIdsLikeName(spaceId, likeWord);
                    refIds.addAll(memberIds);
                    // 模糊搜索邮件
                    if (BooleanUtil.isTrue(params.getSearchEmail())) {
                        refIds.addAll(memberMapper.selectIdsBySpaceIdAndEmailKeyword(spaceId, likeWord));
                    }
                    // 模糊搜索角色
                    List<Long> roleIds = iRoleService.getRoleIdsByKeyWord(spaceId, likeWord);
                    refIds.addAll(roleIds);
                    SocialTenantEntity socialTenantEntity = Optional.ofNullable(socialTenantBindService.getBySpaceId(spaceId))
                            .map(bind -> socialTenantService.getByAppIdAndTenantId(bind.getAppId(), bind.getTenantId()))
                            .orElse(null);
                    if (Objects.nonNull(socialTenantEntity)
                            && SocialPlatformType.WECOM.getValue().equals(socialTenantEntity.getPlatform())
                            && SocialAppType.ISV.getType() == socialTenantEntity.getAppType()) {
                        // 如果是企业微信服务商绑定的空间站，需要查询企微通讯录中符合条件的用户
                        String suiteId = socialTenantEntity.getAppId();
                        String authCorpId = socialTenantEntity.getTenantId();
                        Agent agent = JSONUtil.toBean(socialTenantEntity.getContactAuthScope(), Agent.class);
                        Integer agentId = agent.getAgentId();
                        try {
                            WxCpTpContactSearchResp.QueryResult queryResult = socialCpIsvService.search(suiteId, authCorpId, agentId, likeWord, 1);
                            List<String> cpUserIds = queryResult.getUser().getUserid();
                            if (CollUtil.isNotEmpty(cpUserIds)) {
                                // 将其中未改名的成员填充至返回结果
                                List<Long> socialMemberIds = memberMapper.selectMemberIdsLikeNameByOpenIds(spaceId, cpUserIds);
                                refIds.addAll(socialMemberIds);
                            }
                        }
                        catch (WxErrorException ex) {
                            log.error("Failed to search users from wecom isv.", ex);
                        }
                    }
                }
                else {
                    if (sharer != null) {
                        // 节点分享的分享者
                        refIds.add(sharer);
                    } else if (userId != null) {
                        // 加载最近选择的成员和部门
                        unitIds = userSpaceRemindRecordService.getRemindUnitIds(userId, spaceId);
                        Integer loadCount = limitProperties.getMemberFieldMaxLoadCount();
                        if (CollUtil.isEmpty(unitIds) || unitIds.size() < loadCount) {
                            // 获取该成员最晚加入的小组的同组成员
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
            }
        }
        // 指定过滤的组织单元ID
        if (CollUtil.isNotEmpty(params.getFilterIds())) {
            unitIds.removeAll(params.getFilterIds());
        }
        if (CollUtil.isNotEmpty(unitIds)) {
            return iUnitService.getUnitInfoList(spaceId, unitIds);
        }
        return new ArrayList<>();
    }

    @Override
    public List<UnitInfoVo> accurateSearch(String spaceId, List<String> names) {
        log.info("精准查询组织单元名称,spaceId:{},names:{}", spaceId, names);
        if (CollUtil.isEmpty(names)) {
            return new ArrayList<>();
        }
        // 搜索部门
        List<Long> refIds = teamMapper.selectIdBySpaceIdAndNames(spaceId, names);
        // 搜索成员
        List<Long> memberIds = memberMapper.selectIdBySpaceIdAndNames(spaceId, names);
        refIds.addAll(memberIds);
        if (CollUtil.isEmpty(refIds)) {
            return new ArrayList<>();
        }
        // 获取组织单元ID
        List<Long> unitIds = unitMapper.selectIdsByRefIds(refIds);
        if (CollUtil.isEmpty(unitIds)) {
            return new ArrayList<>();
        }
        return iUnitService.getUnitInfoList(spaceId, unitIds);
    }

    @Override
    public SubUnitResultVo loadMemberFirstTeams(String spaceId, List<Long> teamIds) {
        log.info("加载成员所属部门首层部门信息");
        List<Long> loadTeamIds = this.loadMemberFirstTeamIds(spaceId, teamIds);
        // 获取所需加载部门UnitTeamVo
        List<UnitTeamVo> unitTeamVoList = this.findUnitTeamVo(spaceId, loadTeamIds);
        // 构建返回值
        SubUnitResultVo subUnitResultVo = new SubUnitResultVo();
        subUnitResultVo.setTeams(unitTeamVoList);
        return subUnitResultVo;
    }

    @Override
    public List<Long> loadMemberFirstTeamIds(String spaceId, List<Long> teamIds) {
        log.info("加载成员所属部门首层部门ID");
        // 成员所属部门及所有子级部门Id和parentId
        List<TeamCteInfo> teamsInfo = teamMapper.selectChildTreeByTeamIds(spaceId, teamIds);
        // 成员所属部门及所有子级部门Id
        List<Long> teamIdList = teamsInfo.stream().map(TeamCteInfo::getId).collect(Collectors.toList());
        // 过滤掉不需要加载的部门
        return teamsInfo.stream()
            .filter(teamInfo -> !teamIdList.contains(teamInfo.getParentId()))
            .map(TeamCteInfo::getId).collect(Collectors.toList());
    }
}
