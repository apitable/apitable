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

import static com.apitable.organization.enums.OrganizationException.DUPLICATION_TEAM_NAME;
import static com.apitable.organization.enums.OrganizationException.GET_TEAM_ERROR;
import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toList;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.core.support.tree.DefaultTreeBuildFactory;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.organization.dto.MemberIsolatedInfo;
import com.apitable.organization.dto.MemberTeamInfoDTO;
import com.apitable.organization.dto.TeamBaseInfoDTO;
import com.apitable.organization.dto.TeamCteInfo;
import com.apitable.organization.dto.TeamMemberDTO;
import com.apitable.organization.dto.TeamPathInfo;
import com.apitable.organization.dto.UnitBaseInfoDTO;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.entity.TeamMemberRelEntity;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.OrganizationException;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.facade.TeamFacade;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.mapper.TeamMemberRelMapper;
import com.apitable.organization.mapper.UnitMapper;
import com.apitable.organization.ro.RoleMemberUnitRo;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.ITeamMemberRelService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.organization.vo.MemberPageVo;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.vo.TeamInfoVo;
import com.apitable.organization.vo.TeamTreeVo;
import com.apitable.organization.vo.TeamVo;
import com.apitable.organization.vo.UnitTeamVo;
import com.apitable.shared.util.DBUtil;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.space.vo.SpaceRoleDetailVo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * team service implement.
 */
@Service
@Slf4j
public class TeamServiceImpl extends ServiceImpl<TeamMapper, TeamEntity> implements ITeamService {

    @Resource
    private IUnitService iUnitService;

    @Resource
    private UnitMapper unitMapper;

    @Resource
    private TeamFacade teamFacade;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private TeamMapper teamMapper;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private IRoleMemberService iRoleMemberService;

    @Override
    public String getSpaceIdByTeamId(Long teamId) {
        String spaceId = teamMapper.selectSpaceIdById(teamId);
        ExceptionUtil.isNotNull(spaceId, GET_TEAM_ERROR);
        return spaceId;
    }

    @Override
    public List<TeamBaseInfoDTO> getTeamBaseInfo(List<Long> teamIds) {
        return teamMapper.selectBaseInfoDTOByIds(teamIds);
    }

    @Override
    public List<TeamTreeVo> getTeamTree(String spaceId, Long memberId, Integer depth) {
        // check whether members are isolated from contacts
        MemberIsolatedInfo memberIsolatedInfo =
            this.checkMemberIsolatedBySpaceId(spaceId, memberId);
        if (Boolean.TRUE.equals(memberIsolatedInfo.isIsolated())) {
            List<Long> teamIds = memberIsolatedInfo.getTeamIds();
            List<TeamTreeVo> teamTreeVos = this.getTeamViewInTeamTree(teamIds, depth);
            List<Long> teamIdList =
                teamTreeVos.stream().map(TeamTreeVo::getTeamId).toList();
            // Setting the id of the parent department to 0 is equivalent to raising
            // the level of the directly affiliated department to the first-level department
            for (TeamTreeVo teamVO : teamTreeVos) {
                if (teamIds.contains(teamVO.getTeamId())
                    && !teamIdList.contains(teamVO.getParentId())) {
                    teamVO.setParentId(0L);
                }
            }
            return new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(teamTreeVos);
        }
        Long rootTeamId = this.getRootTeamId(spaceId);
        List<Long> teamIds = new ArrayList<>();
        teamIds.add(rootTeamId);
        List<TeamTreeVo> teamTreeVos = this.getTeamViewInTeamTree(teamIds, depth);
        List<TeamTreeVo> treeVos =
            new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(teamTreeVos);
        treeVos.stream().filter(i -> Objects.equals(i.getTeamId(), rootTeamId))
            .forEach(i -> {
                i.setTeamId(0L);
                i.getChildren().forEach(c -> c.setParentId(0L));
            });
        return treeVos;
    }

    private List<TeamTreeVo> getTeamViewInTeamTree(List<Long> teamIds, Integer depth) {
        List<TeamTreeVo> teamTreeVos =
            DBUtil.batchSelectByFieldIn(teamIds, teamMapper::selectTeamTreeVoByTeamIdIn);
        Map<Long, TeamTreeVo> teamIdToTeamInfoMap = teamTreeVos.stream()
            .collect(Collectors.toMap(TeamTreeVo::getTeamId, Function.identity(),
                (k1, k2) -> k1, LinkedHashMap::new));
        Set<Long> parentIds = teamTreeVos.stream()
            .filter(i -> BooleanUtil.isTrue(i.getHasChildren()))
            .map(TeamTreeVo::getTeamId).collect(Collectors.toSet());
        while (!parentIds.isEmpty() && depth > 0) {
            List<TeamTreeVo> treeVos =
                DBUtil.batchSelectByFieldIn(parentIds, teamMapper::selectTeamTreeVoByParentIdIn);
            if (treeVos.isEmpty()) {
                return new ArrayList<>(teamIdToTeamInfoMap.values());
            }
            parentIds = new HashSet<>();
            for (TeamTreeVo vo : treeVos) {
                if (teamIdToTeamInfoMap.containsKey(vo.getTeamId())) {
                    continue;
                }
                if (BooleanUtil.isTrue(vo.getHasChildren())) {
                    parentIds.add(vo.getTeamId());
                }
                teamIdToTeamInfoMap.put(vo.getTeamId(), vo);
            }
            depth--;
        }
        return new ArrayList<>(teamIdToTeamInfoMap.values());
    }

    @Override
    public List<Long> getAllTeamIdsInTeamTree(Long teamId) {
        return this.getAllTeamIdsInTeamTree(Collections.singletonList(teamId));
    }

    @Override
    public List<Long> getAllTeamIdsInTeamTree(List<Long> teamIds) {
        Set<Long> teamIdSet = new LinkedHashSet<>(teamIds);
        List<Long> parentIds = new ArrayList<>(teamIds);
        while (!parentIds.isEmpty()) {
            List<Long> subTeamIds = teamMapper.selectTeamIdByParentIdIn(parentIds);
            if (subTeamIds.isEmpty()) {
                break;
            }
            parentIds = subTeamIds.stream()
                .filter(i -> !teamIdSet.contains(i))
                .collect(Collectors.toList());
            teamIdSet.addAll(subTeamIds);
        }
        return new ArrayList<>(teamIdSet);
    }

    @Override
    public MemberIsolatedInfo checkMemberIsolatedBySpaceId(String spaceId, Long memberId) {
        log.info("check whether members are isolated from contacts");
        MemberIsolatedInfo memberIsolatedInfo = new MemberIsolatedInfo();
        // Gets the global properties of the current space
        SpaceGlobalFeature features = iSpaceService.getSpaceGlobalFeature(spaceId);
        // obtain the id of the primary administrator
        Long spaceMainAdminId = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        // determine whether to enable address book isolation
        if (Boolean.TRUE.equals(features.getOrgIsolated())
            && Boolean.FALSE.equals(memberId.equals(spaceMainAdminId))) {
            // obtaining administrator information
            SpaceRoleDetailVo spaceRoleDetailVo =
                iSpaceRoleService.getRoleDetail(spaceId, memberId);
            // Check whether you have the contact management permission
            if (Boolean.FALSE.equals(spaceRoleDetailVo.getResources().contains("MANAGE_MEMBER"))
                && Boolean.FALSE.equals(spaceRoleDetailVo.getResources().contains("MANAGE_TEAM"))) {
                // obtain the root department id of the space
                Long rootTeamId = teamMapper.selectRootIdBySpaceId(spaceId);
                // Obtain the id of the department to which a member belongs
                List<Long> teamIds = memberMapper.selectTeamIdsByMemberId(memberId);
                // Determine whether the member is directly affiliated to the root department
                if (Boolean.FALSE.equals(teamIds.contains(rootTeamId))) {
                    memberIsolatedInfo.setIsolated(true);
                    memberIsolatedInfo.setTeamIds(teamIds);
                    return memberIsolatedInfo;
                }
            }
        }
        memberIsolatedInfo.setIsolated(false);
        return memberIsolatedInfo;
    }

    @Override
    public boolean checkHasSubUnitByTeamId(String spaceId, Long teamId) {
        log.info("Check whether the team has members or teams");
        List<Long> subTeamIds = baseMapper.selectTeamIdsByParentId(spaceId, teamId);
        long subMemberCount =
            SqlTool.retCount(teamMemberRelMapper.countByTeamId(Collections.singletonList(teamId)));
        return CollUtil.isNotEmpty(subTeamIds) || subMemberCount > 0;
    }

    @Override
    public long countMemberCountByParentId(Long teamId) {
        log.info("count the team's members, includes the sub teams' members.");
        List<Long> allSubTeamIds = this.getAllTeamIdsInTeamTree(teamId);
        return CollUtil.isNotEmpty(allSubTeamIds)
            ? SqlTool.retCount(teamMemberRelMapper.countByTeamId(allSubTeamIds)) : 0;
    }

    @Override
    public long getMemberCount(List<Long> teamIds) {
        // obtain the number of all members in a department
        return SqlTool.retCount(teamMemberRelMapper.countByTeamId(teamIds));
    }

    @Override
    public List<Long> getMemberIdsByTeamIds(List<Long> teamIds) {
        List<Long> allTeamIds = this.getAllTeamIdsInTeamTree(teamIds);
        return teamMemberRelMapper.selectMemberIdsByTeamIds(allTeamIds);
    }

    @Override
    public Long getRootTeamId(String spaceId) {
        return baseMapper.selectRootIdBySpaceId(spaceId);
    }

    @Override
    public Long getRootTeamUnitId(String spaceId) {
        Long rootTeamId = this.getRootTeamId(spaceId);
        return unitMapper.selectUnitIdByRefId(rootTeamId);
    }

    @Override
    public List<Long> getUnitsByTeam(Long teamId) {
        log.info("Gets the organizational unit for the team and all parent teams.");
        List<Long> teamIds = teamFacade.getAllParentTeamIds(teamId);
        List<Long> roleIds = iRoleMemberService.getRoleIdsByRoleMemberId(teamId);
        return iUnitService.getUnitIdsByRefIds(CollUtil.addAll(teamIds, roleIds));
    }

    @Override
    public Long getParentId(Long teamId) {
        return baseMapper.selectParentIdByTeamId(teamId);
    }

    @Override
    public int getMaxSequenceByParentId(Long parentId) {
        Integer maxSequence = baseMapper.selectMaxSequenceByParentId(parentId);
        return Optional.ofNullable(maxSequence).orElse(0);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createRootTeam(String spaceId, String spaceName) {
        log.info("create root team:{}", spaceName);
        TeamEntity rootTeam = new TeamEntity();
        rootTeam.setSpaceId(spaceId);
        rootTeam.setTeamName(spaceName);
        boolean flag = save(rootTeam);
        ExceptionUtil.isTrue(flag, OrganizationException.CREATE_TEAM_ERROR);
        return rootTeam.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void batchCreateTeam(String spaceId, List<TeamEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        boolean flag = saveBatch(entities);
        ExceptionUtil.isTrue(flag, OrganizationException.CREATE_TEAM_ERROR);
        List<UnitEntity> unitEntities = new ArrayList<>();
        entities.forEach(team -> {
            UnitEntity unit = new UnitEntity();
            unit.setId(IdWorker.getId());
            unit.setUnitId(IdUtil.fastSimpleUUID());
            unit.setSpaceId(spaceId);
            unit.setUnitType(UnitType.TEAM.getType());
            unit.setUnitRefId(team.getId());
            unitEntities.add(unit);
        });
        iUnitService.createBatch(unitEntities);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createSubTeam(String spaceId, String name, Long parentId) {
        log.info("create sub team:{}", name);
        int max = getMaxSequenceByParentId(parentId);
        TeamEntity team = new TeamEntity();
        team.setSpaceId(spaceId);
        team.setTeamName(name);
        team.setParentId(parentId);
        team.setSequence(max + 1);
        boolean flag = save(team);
        ExceptionUtil.isTrue(flag, OrganizationException.CREATE_TEAM_ERROR);
        iUnitService.create(spaceId, UnitType.TEAM, team.getId());
        return team.getId();
    }

    @Override
    public Long createSubTeam(String spaceId, String name, Long superId, Integer sequence) {
        log.info("create sub team:{}", name);
        if (null == sequence) {
            sequence = getMaxSequenceByParentId(superId) + 1;
        }
        TeamEntity team = new TeamEntity();
        team.setSpaceId(spaceId);
        team.setTeamName(name);
        team.setParentId(superId);
        team.setSequence(sequence);
        boolean flag = save(team);
        ExceptionUtil.isTrue(flag, OrganizationException.CREATE_TEAM_ERROR);
        iUnitService.create(spaceId, UnitType.TEAM, team.getId());
        return team.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createSubTeam(String spaceId, String name, Long superId, Integer sequence,
                              List<Long> roleIds) {
        Long teamId = createSubTeam(spaceId, name, superId, sequence);
        if (!roleIds.isEmpty()) {
            RoleMemberUnitRo roleMember = new RoleMemberUnitRo();
            roleMember.setId(teamId);
            roleMember.setType(UnitType.TEAM.getType());
            for (Long roleId : roleIds) {
                iRoleMemberService.addRoleMembers(roleId, Collections.singletonList(roleMember));
            }
        }
        return teamId;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<Long> createBatchByTeamName(String spaceId, Long rootTeamId,
                                            List<String> teamNames) {
        List<Long> teamIds = new ArrayList<>();
        // Take the last index, or there may be only one department level
        int lastIndex = teamNames.size() - 1;
        Long parentId = rootTeamId;
        for (int i = 0; i < teamNames.size(); i++) {
            String name = teamNames.get(i);
            // Find the department name and align the parent departments
            TeamEntity findTeam = baseMapper.selectBySpaceIdAndName(spaceId, name, parentId);
            if (findTeam != null) {
                // Existing, not created
                parentId = findTeam.getId();
                if (i == lastIndex) {
                    teamIds.add(findTeam.getId());
                }
            } else {
                // No, create a new department
                parentId = createSubTeam(spaceId, name, parentId);
                if (i == lastIndex) {
                    teamIds.add(parentId);
                }
            }
        }
        return teamIds;
    }

    @Override
    public Long getByTeamNamePath(String spaceId, List<String> teamNames) {
        // Make sure it's legitimate data before get in here
        String lastTeamName = CollUtil.getLast(teamNames);
        if (StrUtil.isBlank(lastTeamName)) {
            return null;
        }
        List<TeamPathInfo> teams = teamMapper.selectInfoByTeamName(spaceId, lastTeamName);
        if (teams.isEmpty()) {
            return null;
        }
        Map<Long, Long> teamIdToParentIdMap = teams.stream()
            .filter(i -> !i.getParentId().equals(0L))
            .collect(Collectors.toMap(TeamPathInfo::getId, TeamPathInfo::getParentId));
        if (!teamIdToParentIdMap.isEmpty()) {
            List<TeamPathInfo> parentTeams =
                teamFacade.getAllParentTeam(teamIdToParentIdMap.values());
            if (!parentTeams.isEmpty()) {
                Set<Long> teamIds = teamIdToParentIdMap.keySet();
                parentTeams.stream().filter(i -> !teamIds.contains(i.getId()))
                    .forEach(teams::add);
            }
        }
        // The department name service is repeated, split into a tree, and searched using the tree
        Map<String, Long> teamPathName = buildTreeTeamList(teams, lastTeamName);
        // Recombine department level strings.
        // To be on the safe side, remove the space between each department.
        String withoutBlankTeamNamePath = CollUtil.join(teamNames, "-");
        return teamPathName.getOrDefault(withoutBlankTeamNamePath, null);
    }

    private Map<String, Long> buildTreeTeamList(List<TeamPathInfo> teamEntities, String teamName) {
        Map<String, Long> teamPathMap = new HashMap<>();
        List<Long> teamIds = teamEntities.stream()
            .filter(e -> e.getTeamName().equals(teamName))
            .map(TeamPathInfo::getId).toList();
        teamIds.forEach(teamId -> {
            List<String> teamPath = new ArrayList<>();
            findParentTeam(teamEntities, teamId, teamPath::add);
            Collections.reverse(teamPath);
            teamPathMap.put(CollUtil.join(teamPath, "-"), teamId);
        });
        return teamPathMap;
    }

    private void findParentTeam(List<TeamPathInfo> teamEntities, Long teamId,
                                Consumer<String> teamPath) {
        for (TeamPathInfo teamEntity : teamEntities) {
            if (teamEntity.getId().equals(teamId)
                && !teamEntity.getParentId().equals(0L)) {
                teamPath.accept(teamEntity.getTeamName());
                findParentTeam(teamEntities, teamEntity.getParentId(), teamPath);
                break;
            }
        }
    }

    @Override
    public TeamInfoVo getTeamInfoById(Long teamId) {
        TeamInfoVo teamInfo = new TeamInfoVo();
        TeamEntity team = teamMapper.selectById(teamId);
        if (team == null) {
            return teamInfo;
        }
        teamInfo.setTeamName(team.getTeamName());
        if (team.getParentId() == 0L) {
            teamInfo.setTeamId(0L);
            Long memberCount =
                SqlTool.retCount(memberMapper.selectCountBySpaceId(team.getSpaceId()));
            teamInfo.setMemberCount(memberCount);
            return teamInfo;
        }
        teamInfo.setTeamId(teamId);
        List<Long> teamIds = this.getAllTeamIdsInTeamTree(teamId);
        Long memberCount = SqlHelper.retCount(teamMemberRelMapper.countByTeamId(teamIds));
        teamInfo.setMemberCount(memberCount);
        return teamInfo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateTeamName(Long teamId, String teamName) {
        log.info("update team name");
        TeamEntity update = new TeamEntity();
        update.setId(teamId);
        update.setTeamName(teamName);
        boolean flag = updateById(update);
        ExceptionUtil.isTrue(flag, OrganizationException.UPDATE_TEAM_NAME_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateTeamParent(Long teamId, String teamName, Long parentId) {
        log.info("adjust the team hierarchy");
        TeamEntity update = new TeamEntity();
        update.setId(teamId);
        update.setTeamName(teamName);
        update.setParentId(parentId);
        Integer maxSequence = baseMapper.selectMaxSequenceByParentId(parentId);
        int max = Optional.ofNullable(maxSequence).orElse(0);
        update.setSequence(max + 1);
        boolean flag = updateById(update);
        ExceptionUtil.isTrue(flag, OrganizationException.UPDATE_TEAM_NAME_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateTeam(TeamEntity team, List<Long> roleIds) {
        updateById(team);
        if (!roleIds.isEmpty()) {
            iRoleMemberService.removeByRoleMemberIds(Collections.singletonList(team.getId()));
            RoleMemberUnitRo roleMember = new RoleMemberUnitRo();
            roleMember.setId(team.getId());
            roleMember.setType(UnitType.TEAM.getType());
            for (Long roleId : roleIds) {
                iRoleMemberService.addRoleMembers(roleId, Collections.singletonList(roleMember));
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteTeam(Long teamId) {
        log.info("delete team");
        iRoleMemberService.removeByRoleMemberIds(CollUtil.newArrayList(teamId));
        boolean flag = removeById(teamId);
        ExceptionUtil.isTrue(flag, OrganizationException.DELETE_TEAM_ERROR);
        iUnitService.removeByTeamId(teamId);
        // delete the department and remove the public link
        iSpaceInviteLinkService.deleteByTeamIds(Collections.singletonList(teamId));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteTeam(Collection<Long> teamIds) {
        log.info("batch delete team");
        if (CollUtil.isEmpty(teamIds)) {
            return;
        }
        iRoleMemberService.removeByRoleMemberIds(teamIds);
        boolean flag = removeByIds(teamIds);
        ExceptionUtil.isTrue(flag, OrganizationException.DELETE_TEAM_ERROR);
        // deleting a department association
        iTeamMemberRelService.removeByTeamIds(teamIds);
        // Delete departments in batches and delete public links
        iSpaceInviteLinkService.deleteByTeamIds(teamIds);
    }

    @Override
    public List<TeamTreeVo> build(String spaceId, Long id) {
        List<TeamMemberDTO> results = baseMapper.selectTeamsBySpaceId(spaceId, id);
        List<TeamTreeVo> res = new ArrayList<>();
        for (TeamMemberDTO node : results) {
            List<Long> memberIds = new ArrayList<>();
            recurse(results, node, memberIds);
            List<Long> distinctMemberIds = CollUtil.distinct(memberIds);
            TeamTreeVo teamTreeVo = new TeamTreeVo();
            teamTreeVo.setTeamId(node.getTeamId());
            teamTreeVo.setTeamName(node.getTeamName());
            teamTreeVo.setParentId(node.getParentId());
            teamTreeVo.setMemberCount(distinctMemberIds.size());
            teamTreeVo.setSequence(node.getSequence());
            res.add(teamTreeVo);
        }
        return res;
    }

    @Override
    public List<TeamTreeVo> buildTree(String spaceId, List<Long> teamIds) {
        if (teamIds.isEmpty()) {
            return new ArrayList<>();
        }
        Long rootTeamId = baseMapper.selectRootIdBySpaceId(spaceId);
        List<TeamMemberDTO> resultList =
            baseMapper.selectMemberTeamsBySpaceIdAndTeamIds(spaceId, teamIds);
        List<TeamTreeVo> res = new ArrayList<>();
        for (TeamMemberDTO node : resultList) {
            List<Long> memberIds = new ArrayList<>();
            recurse(resultList, node, memberIds);
            List<Long> distinctMemberIds = CollUtil.distinct(memberIds);
            TeamTreeVo teamTreeVo = new TeamTreeVo();
            teamTreeVo.setTeamId(node.getTeamId());
            teamTreeVo.setTeamName(node.getTeamName());
            teamTreeVo.setParentId(node.getParentId().equals(rootTeamId) ? 0L : node.getParentId());
            teamTreeVo.setMemberCount(distinctMemberIds.size());
            teamTreeVo.setSequence(node.getSequence());
            res.add(teamTreeVo);
        }
        return res;
    }

    @Override
    public List<Long> getTeamIdsBySpaceId(String spaceId) {
        return baseMapper.selectTeamAllIdBySpaceId(spaceId);
    }

    @Override
    public List<UnitTeamVo> getUnitTeamVo(String spaceId, List<Long> teamIds) {
        return DBUtil.batchSelectByFieldIn(teamIds,
            (ids) -> teamMapper.selectUnitTeamVoByTeamIds(spaceId, ids));
    }

    @Override
    public void handlePageMemberTeams(IPage<MemberPageVo> page, String spaceId) {
        // get all member's id
        List<Long> memberIds =
            page.getRecords().stream().map(MemberPageVo::getMemberId).collect(Collectors.toList());
        // handle member's team name. get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap =
            this.batchGetFullHierarchyTeamNames(memberIds, spaceId);
        for (MemberPageVo memberPageVo : page.getRecords()) {
            if (memberToTeamPathInfoMap.containsKey(memberPageVo.getMemberId())) {
                memberPageVo.setTeamData(memberToTeamPathInfoMap.get(memberPageVo.getMemberId()));
            }
        }
    }

    @Override
    public Map<Long, List<MemberTeamPathInfo>> batchGetFullHierarchyTeamNames(List<Long> memberIds,
                                                                              String spaceId) {
        if (CollUtil.isEmpty(memberIds)) {
            return new HashMap<>();
        }
        // batch get memberId and teamId
        List<MemberTeamInfoDTO> memberTeamInfoList =
            memberMapper.selectTeamIdsByMemberIds(memberIds);
        // group by memberId
        Map<Long, List<Long>> memberTeamMap = memberTeamInfoList.stream()
            .collect(Collectors.groupingBy(MemberTeamInfoDTO::getMemberId,
                mapping(MemberTeamInfoDTO::getTeamId, Collectors.toList())));
        // get member's each full hierarchy team name
        Map<Long, List<String>> teamIdToPathMap =
            this.getMemberEachTeamPathName(memberTeamMap, spaceId);
        // build return object, each team's id and team's full hierarchy path name
        Map<Long, List<MemberTeamPathInfo>> memberToAllTeamPathNameMap = new HashMap<>();
        for (Entry<Long, List<Long>> entry : memberTeamMap.entrySet()) {
            List<MemberTeamPathInfo> memberTeamPathInfos = new ArrayList<>();
            for (Long teamId : entry.getValue()) {
                if (teamIdToPathMap.containsKey(teamId)) {
                    // build return team info and format team name
                    MemberTeamPathInfo memberTeamPathInfo = new MemberTeamPathInfo();
                    memberTeamPathInfo.setTeamId(teamId);
                    String fullHierarchyTeamName =
                        StrUtil.join("/", teamIdToPathMap.get(teamId));
                    memberTeamPathInfo.setFullHierarchyTeamName(fullHierarchyTeamName);
                    memberTeamPathInfos.add(memberTeamPathInfo);
                }
            }
            memberToAllTeamPathNameMap.put(entry.getKey(), memberTeamPathInfos);
        }
        return memberToAllTeamPathNameMap;
    }

    @Override
    public void checkNameExists(String spaceId, Long parentId, String name) {
        int count = SqlTool.retCount(
            baseMapper.selectCountByParentIdAndSpaceIdAndTeamName(parentId, spaceId, name));
        ExceptionUtil.isFalse(count > 0, DUPLICATION_TEAM_NAME);
    }

    @Override
    public void checkNameExists(String spaceId, Long parentId, Long teamId, String name) {
        int count = SqlTool.retCount(
            baseMapper.selectCountByParentIdAndSpaceIdAndTeamNameWithExceptId(parentId, spaceId,
                teamId, name));
        ExceptionUtil.isFalse(count > 0, DUPLICATION_TEAM_NAME);
    }

    @Override
    public Long getTeamIdByUnitId(String spaceId, String unitId, Consumer<Boolean> consumer) {
        if ("0".equals(unitId)) {
            return getRootTeamId(spaceId);
        }
        Long teamId = iUnitService.getUnitRefIdByUnitIdAndSpaceIdAndUnitType(unitId, spaceId,
            UnitType.TEAM);
        consumer.accept(null != teamId);
        return teamId;
    }

    @Override
    public List<Long> getTeamIdsByUnitIds(String spaceId, List<String> unitIds) {
        if (unitIds.isEmpty()) {
            return new ArrayList<>();
        }
        return iUnitService.getUnitBaseInfoBySpaceIdAndUnitTypeAndUnitIds(spaceId, UnitType.TEAM,
            unitIds).stream().map(UnitBaseInfoDTO::getUnitRefId).collect(
            Collectors.toList());
    }

    @Override
    public TeamEntity getTeamByUnitId(String spaceId, String unitId) {
        Long teamId = getTeamIdByUnitId(spaceId, unitId,
            status -> ExceptionUtil.isTrue(status, GET_TEAM_ERROR));
        TeamEntity department = getById(teamId);
        ExceptionUtil.isNotNull(department, GET_TEAM_ERROR);
        return department;
    }

    @Override
    public Map<Long, List<String>> getMembersTeamName(List<Long> memberIds) {
        List<TeamMemberRelEntity> memberTeamRel = iTeamMemberRelService.getByMemberIds(memberIds);
        if (memberTeamRel.isEmpty()) {
            return new HashMap<>(0);
        }
        List<Long> teamIds =
            memberTeamRel.stream().map(TeamMemberRelEntity::getTeamId).distinct().toList();
        Map<Long, List<Long>> memberTeamIdMap = memberTeamRel.stream().collect(
            Collectors.groupingBy(TeamMemberRelEntity::getMemberId,
                mapping(TeamMemberRelEntity::getTeamId, toList())));
        Map<Long, String> teamNameMap = baseMapper.selectBaseInfoDTOByIds(teamIds)
            .stream()
            .collect(Collectors.toMap(TeamBaseInfoDTO::getId, TeamBaseInfoDTO::getTeamName));
        Map<Long, List<String>> memberTeamMap = new HashMap<>();
        for (Long memberId : memberIds) {
            if (!memberTeamIdMap.containsKey(memberId)) {
                continue;
            }
            List<String> teamNames =
                memberTeamIdMap.get(memberId).stream().map(teamNameMap::get).toList();
            memberTeamMap.put(memberId, teamNames);
        }
        return memberTeamMap;
    }

    @Override
    public Map<Long, List<String>> getMemberEachTeamPathName(Map<Long, List<Long>> memberTeamMap,
                                                             String spaceId) {
        // get all teamIds
        Set<Long> allTeamIds = new HashSet<>();
        for (Entry<Long, List<Long>> entry : memberTeamMap.entrySet()) {
            allTeamIds.addAll(entry.getValue());
        }
        if (allTeamIds.isEmpty()) {
            return new HashMap<>();
        }
        // get member's team's all parent team, include itself
        List<TeamPathInfo> teams = teamFacade.getAllParentTeam(allTeamIds);
        List<TeamTreeVo> teamTreeVos = this.buildTree(spaceId,
            teams.stream().map(TeamCteInfo::getId).collect(Collectors.toList()));
        // build team tree
        List<TeamTreeVo> treeVos =
            new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(teamTreeVos);
        Map<Long, List<String>> teamIdToPathMap = new HashMap<>();
        // TODO:optimize just recurse first level nodeId
        for (TeamTreeVo treeVo : treeVos) {
            // current team full hierarchy team name
            final List<String> teamNames = new ArrayList<>();
            List<TeamVo> teamVos = new ArrayList<>();
            // build team info object, include teamId and teamName
            TeamVo teamVo = new TeamVo();
            teamVo.setTeamId(treeVo.getTeamId());
            teamVo.setTeamName(treeVo.getTeamName());
            teamVos.add(teamVo);
            teamNames.add(treeVo.getTeamName());
            if (allTeamIds.contains(treeVo.getTeamId())) {
                teamIdToPathMap.put(treeVo.getTeamId(), teamNames);
            }
            if (CollUtil.isNotEmpty(treeVo.getChildren())) {
                // recurse get this branch's all teamIds and teamNames
                this.recurseGetBranchAllTeamIdsAndTeamNames(treeVo.getChildren(), teamVos,
                    allTeamIds, teamNames, teamIdToPathMap);
            }
        }
        return teamIdToPathMap;
    }

    /**
     * recurse get member's teamId and teamName.
     *
     * @param treeVo          team tree view
     * @param teamVos         team's view
     * @param allTeamIds      member's all teamIds
     * @param teamNames       member's team path name
     * @param teamIdToPathMap memberId with member's team name map
     */
    private void recurseGetBranchAllTeamIdsAndTeamNames(List<TeamTreeVo> treeVo,
                                                        List<TeamVo> teamVos, Set<Long> allTeamIds,
                                                        List<String> teamNames,
                                                        Map<Long, List<String>> teamIdToPathMap) {
        for (TeamTreeVo team : treeVo) {
            if (allTeamIds.contains(team.getTeamId())) {
                List<String> branchNames = new ArrayList<>(teamNames);
                branchNames.add(team.getTeamName());
                teamIdToPathMap.put(team.getTeamId(), branchNames);
                allTeamIds.remove(team.getTeamId());
            }
            TeamVo teamVo = new TeamVo();
            teamVo.setTeamId(team.getTeamId());
            teamVo.setTeamName(team.getTeamName());
            teamVos.add(teamVo);
            List<String> branchNames = new ArrayList<>(teamNames);
            branchNames.add(team.getTeamName());
            if (CollUtil.isNotEmpty(team.getChildren())) {
                recurseGetBranchAllTeamIdsAndTeamNames(team.getChildren(), teamVos, allTeamIds,
                    branchNames, teamIdToPathMap);
            }
        }
    }

    /**
     * recursive processing.
     *
     * @param resultList list
     * @param node       node
     * @param memberIds  member id
     */
    private void recurse(List<TeamMemberDTO> resultList, TeamMemberDTO node, List<Long> memberIds) {
        List<TeamMemberDTO> subChildren = getChildNode(resultList, node);
        if (CollUtil.isNotEmpty(subChildren)) {
            for (TeamMemberDTO sub : subChildren) {
                recurse(resultList, sub, memberIds);
            }
        }
        memberIds.addAll(node.getMemberIds());
    }

    /**
     * get child nodes.
     *
     * @param resultList list
     * @param node       node
     * @return child nodes
     */
    private List<TeamMemberDTO> getChildNode(List<TeamMemberDTO> resultList, TeamMemberDTO node) {
        List<TeamMemberDTO> nodeList = new ArrayList<>();
        for (TeamMemberDTO item : resultList) {
            if (item.getParentId().equals(node.getTeamId())) {
                nodeList.add(item);
            }
        }
        return nodeList;
    }
}
