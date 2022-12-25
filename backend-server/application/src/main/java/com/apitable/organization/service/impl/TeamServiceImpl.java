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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.apitable.organization.enums.UnitType;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.organization.dto.TeamMemberDTO;
import com.apitable.organization.vo.MemberInfoVo;
import com.apitable.organization.vo.MemberPageVo;
import com.apitable.organization.vo.TeamInfoVo;
import com.apitable.organization.vo.TeamTreeVo;
import com.apitable.organization.vo.TeamVo;
import com.apitable.organization.vo.UnitTeamVo;
import com.apitable.space.vo.SpaceRoleDetailVo;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.mapper.TeamMemberRelMapper;
import com.apitable.organization.mapper.UnitMapper;
import com.apitable.organization.dto.MemberIsolatedInfo;
import com.apitable.organization.dto.MemberTeamInfoDTO;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.dto.TeamCteInfo;
import com.apitable.organization.dto.TeamPathInfo;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.ITeamMemberRelService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.space.mapper.SpaceMapper;
import com.apitable.space.service.ISpaceInviteLinkService;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.space.service.ISpaceService;
import com.apitable.organization.enums.OrganizationException;
import com.apitable.core.support.tree.DefaultTreeBuildFactory;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.space.entity.SpaceEntity;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.entity.UnitEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class TeamServiceImpl extends ServiceImpl<TeamMapper, TeamEntity> implements ITeamService {

    @Resource
    private IUnitService iUnitService;

    @Resource
    private UnitMapper unitMapper;

    @Resource
    private TeamMemberRelMapper teamMemberRelMapper;

    @Resource
    private ITeamMemberRelService iTeamMemberRelService;

    @Resource
    private ISpaceInviteLinkService iSpaceInviteLinkService;

    @Resource
    private SpaceMapper spaceMapper;

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
    public Set<Long> getTeamIdsByMemberId(String spaceId, Long memberId) {
        log.info("query the member's team includes all parent team.");
        List<Long> teamIds = teamMemberRelMapper.selectTeamIdsByMemberId(memberId);
        List<TeamEntity> allTeams = baseMapper.selectAllBySpaceId(spaceId);
        Set<Long> resultList = new HashSet<>();
        for (Long teamId : teamIds) {
            TeamEntity team = CollUtil.findOne(allTeams, entity -> entity.getId().equals(teamId));
            // check all parent ids
            Set<Long> allTeamIds = inverseRecursive(allTeams, team);
            resultList.addAll(allTeamIds);
        }
        return resultList;
    }

    /**
     * reverse traversal queries all parent levels
     */
    private Set<Long> inverseRecursive(List<TeamEntity> teamList, TeamEntity node) {
        Set<Long> resultList = new HashSet<>();
        resultList.add(node.getId());
        if (node.getParentId() != 0) {
            for (TeamEntity team : teamList) {
                if (node.getParentId().equals(team.getId())) {
                    Set<Long> parent = inverseRecursive(teamList, team);
                    resultList.addAll(parent);
                }
            }
        }
        return resultList;
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
        if (Boolean.TRUE.equals(features.getOrgIsolated()) && Boolean.FALSE.equals(spaceMainAdminId.equals(memberId))) {
            // obtaining administrator information
            SpaceRoleDetailVo spaceRoleDetailVo = iSpaceRoleService.getRoleDetail(spaceId, memberId);
            // Check whether you have the contact management permission
            if (Boolean.FALSE.equals(spaceRoleDetailVo.getResources().contains("MANAGE_MEMBER")) && Boolean.FALSE.equals(spaceRoleDetailVo.getResources().contains("MANAGE_TEAM"))) {
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
        int subMemberCount = SqlTool.retCount(teamMemberRelMapper.countByTeamId(Collections.singletonList(teamId)));
        return CollUtil.isNotEmpty(subTeamIds) || subMemberCount > 0;
    }

    @Override
    public int countMemberCountByParentId(Long teamId) {
        log.info("count the team's members, includes the sub teams' members.");
        List<Long> allSubTeamIds = baseMapper.selectAllSubTeamIdsByParentId(teamId, true);
        return CollUtil.isNotEmpty(allSubTeamIds) ? SqlTool.retCount(teamMemberRelMapper.countByTeamId(allSubTeamIds)) : 0;
    }

    @Override
    public int getMemberCount(List<Long> teamIds) {
        // obtain the number of all members in a department
        return SqlTool.retCount(teamMemberRelMapper.countByTeamId(teamIds));
    }

    @Override
    public List<Long> getMemberIdsByTeamIds(List<Long> teamIds) {
        List<Long> subTeamIds = baseMapper.selectAllSubTeamIds(teamIds);
        return teamMemberRelMapper.selectMemberIdsByTeamIds(CollUtil.union(teamIds, subTeamIds));
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
        List<Long> teamIds = baseMapper.selectAllParentTeamIds(teamId, true);
        List<Long> roleIds = iRoleMemberService.getRoleIdsByRoleMemberId(teamId);
        return iUnitService.getUnitIdsByRefIds(CollUtil.addAll(teamIds, roleIds));
    }

    @Override
    public Long getParentId(Long teamId) {
        return baseMapper.selectParentIdByTeamId(teamId);
    }

    @Override
    public List<Long> getAllSubTeamIdsByParentId(Long teamId) {
        return baseMapper.selectAllSubTeamIdsByParentId(teamId, false);
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
    @Transactional(rollbackFor = Exception.class)
    public List<Long> createBatchByTeamName(String spaceId, Long rootTeamId, List<String> teamNames) {
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
            }
            else {
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
        // query the department level path by department
        List<TeamEntity> teamEntities = baseMapper.selectTreeByTeamName(spaceId, lastTeamName);
        // The department name service is repeated, split into a tree, and searched using the tree
        Map<String, Long> teamPathName = buildTreeTeamList(teamEntities, lastTeamName);
        // recombine department level strings. To be on the safe side, remove the space between each department.
        String withoutBlankTeamNamePath = CollUtil.join(teamNames, "-");
        return teamPathName.getOrDefault(withoutBlankTeamNamePath, null);
    }

    public Map<String, Long> buildTreeTeamList(List<TeamEntity> teamEntities, String teamName) {
        Map<String, Long> teamPathMap = new HashMap<>();
        List<Long> teamIds = teamEntities.stream()
                .filter(e -> e.getTeamName().equals(teamName))
                .map(TeamEntity::getId).collect(Collectors.toList());
        teamIds.forEach(teamId -> {
            List<String> teamPath = new ArrayList<>();
            findParentTeam(teamEntities, teamId, teamPath::add);
            Collections.reverse(teamPath);
            teamPathMap.put(CollUtil.join(teamPath, "-"), teamId);
        });
        return teamPathMap;
    }

    private void findParentTeam(List<TeamEntity> teamEntities, Long teamId, Consumer<String> teamPath) {
        for (TeamEntity teamEntity : teamEntities) {
            if (teamEntity.getId().equals(teamId) && !teamEntity.getParentId().equals(0L)) {
                teamPath.accept(teamEntity.getTeamName());
                findParentTeam(teamEntities, teamEntity.getParentId(), teamPath);
            }
        }
    }

    @Override
    public TeamInfoVo getTeamInfoById(String spaceId, Long teamId) {
        log.info("get team info by id");
        Long rootTeamId = baseMapper.selectRootIdBySpaceId(spaceId);
        ExceptionUtil.isNotNull(rootTeamId, OrganizationException.GET_TEAM_ERROR);
        SpaceEntity spaceEntity = spaceMapper.selectBySpaceId(spaceId);
        ExceptionUtil.isNotNull(spaceEntity, OrganizationException.GET_TEAM_ERROR);
        TeamInfoVo teamInfo = new TeamInfoVo();
        if (teamId == 0) {
            // query root team，default root team is 0.
            teamInfo.setTeamId(0L);
            teamInfo.setTeamName(spaceEntity.getName());
            teamInfo.setSequence(1);
            List<Long> subTeamIds = baseMapper.selectTeamIdsByParentId(spaceId, rootTeamId);
            if (CollUtil.isNotEmpty(subTeamIds)) {
                teamInfo.setHasChildren(true);
            }
            // total number of enquiries
            int memberCount = SqlTool.retCount(memberMapper.selectCountBySpaceId(spaceId));
            teamInfo.setMemberCount(memberCount);
            //  query the number of active members
            int activateMemberCount = SqlTool.retCount(memberMapper.selectActiveMemberCountBySpaceId(spaceId));
            teamInfo.setActivateMemberCount(activateMemberCount);
            return teamInfo;
        }
        // Query information about non-root departments
        TeamEntity teamEntity = baseMapper.selectById(teamId);
        ExceptionUtil.isNotNull(teamEntity, OrganizationException.GET_TEAM_ERROR);
        teamInfo.setTeamId(teamId);
        teamInfo.setTeamName(teamEntity.getTeamName());
        teamInfo.setSequence(teamEntity.getSequence());
        if (rootTeamId.equals(teamEntity.getParentId())) {
            teamInfo.setParentId(0L);
            teamInfo.setParentTeamName(spaceEntity.getName());
        }
        else {
            teamInfo.setParentId(teamEntity.getParentId());
            String parentTeamName = baseMapper.selectTeamNameById(teamEntity.getParentId());
            teamInfo.setParentTeamName(parentTeamName);
        }
        List<Long> subTeamIds = baseMapper.selectTeamIdsByParentId(spaceId, teamId);
        if (CollUtil.isNotEmpty(subTeamIds)) {
            // get the number of people in the sub departments
            teamInfo.setHasChildren(true);
            List<Long> memberIds = teamMemberRelMapper.selectMemberIdsByTeamIds(subTeamIds);
            teamInfo.setMemberCount(memberIds.isEmpty() ? 0 : new HashSet<>(memberIds).size());
            // Gets the number of activated people in sub departments
            List<Long> activeMemberIds = teamMemberRelMapper.selectActiveMemberIdsByTeamIds(subTeamIds);
            teamInfo.setActivateMemberCount(memberIds.isEmpty() ? 0 : new HashSet<>(activeMemberIds).size());
        }
        else {
            teamInfo.setMemberCount(baseMapper.selectMemberCountByTeamId(teamId));
            teamInfo.setActivateMemberCount(baseMapper.selectActiveMemberCountByTeamId(teamId));
        }
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
    public void deleteTeam(Long teamId) {
        log.info("delete team");
        iRoleMemberService.removeByRoleMemberIds(CollUtil.newArrayList(teamId));
        boolean flag = removeById(teamId);
        ExceptionUtil.isTrue(flag, OrganizationException.DELETE_TEAM_ERROR);
        iUnitService.removeByTeamId(teamId);
        // delete the department and remove the public link
        iSpaceInviteLinkService.deleteByTeamId(teamId);
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
    @Transactional(rollbackFor = Exception.class)
    public void deleteSubTeam(String spaceId, Long teamId) {
        log.info("delete sub team");
        List<Long> subTeamIds = baseMapper.selectAllSubTeamIdsByParentId(teamId, false);
        if (CollUtil.isEmpty(subTeamIds)) {
            return;
        }
        iRoleMemberService.removeByRoleMemberIds(subTeamIds);
        boolean flag = removeByIds(subTeamIds);
        ExceptionUtil.isTrue(flag, OrganizationException.DELETE_TEAM_ERROR);
        // deleting organization departments
        iUnitService.batchRemoveByTeamId(subTeamIds);
        // Delete departments in batches and delete public links
        iSpaceInviteLinkService.deleteByTeamIds(subTeamIds);
    }

    @Override
    public List<TeamTreeVo> build(String spaceId, Long id) {
        List<TeamMemberDTO> results = baseMapper.selectTeamsBySpaceId(spaceId, id);
        List<TeamTreeVo> res = new ArrayList<>();
        for (TeamMemberDTO node : results) {
            List<Long> memberIds = new ArrayList<>();
            recurse(results, node, memberIds);
            List<Long> mIds = CollUtil.distinct(memberIds);
            TeamTreeVo teamTreeVo = new TeamTreeVo();
            teamTreeVo.setTeamId(node.getTeamId());
            teamTreeVo.setTeamName(node.getTeamName());
            teamTreeVo.setParentId(node.getParentId());
            teamTreeVo.setMemberCount(mIds.size());
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
        List<TeamMemberDTO> resultList = baseMapper.selectMemberTeamsBySpaceIdAndTeamIds(spaceId, teamIds);
        List<TeamTreeVo> res = new ArrayList<>();
        for (TeamMemberDTO node : resultList) {
            List<Long> memberIds = new ArrayList<>();
            recurse(resultList, node, memberIds);
            List<Long> mIds = CollUtil.distinct(memberIds);
            TeamTreeVo teamTreeVo = new TeamTreeVo();
            teamTreeVo.setTeamId(node.getTeamId());
            teamTreeVo.setTeamName(node.getTeamName());
            teamTreeVo.setParentId(node.getParentId().equals(rootTeamId) ? 0L : node.getParentId());
            teamTreeVo.setMemberCount(mIds.size());
            teamTreeVo.setSequence(node.getSequence());
            res.add(teamTreeVo);
        }
        return res;
    }

    @Override
    public Map<Long, Integer> getTeamMemberCountMap(Long teamId) {
        List<Long> ids = baseMapper.selectAllSubTeamIdsByParentId(teamId, true);
        Map<Long, Integer> map = new HashMap<>(ids.size());
        if (CollUtil.isNotEmpty(ids)) {
            List<TeamMemberDTO> dtoList = baseMapper.selectTeamsByIds(ids);
            dtoList.forEach(dto -> {
                List<Long> memberIds = new ArrayList<>();
                recurse(dtoList, dto, memberIds);
                List<Long> mIds = CollUtil.distinct(memberIds);
                map.put(dto.getTeamId(), mIds.size());
            });
        }
        return map;
    }

    @Override
    public List<Long> getTeamIdsBySpaceId(String spaceId) {
        return baseMapper.selectTeamAllIdBySpaceId(spaceId);
    }

    @Override
    public List<TeamTreeVo> getMemberTeamTree(String spaceId, List<Long> teamIds) {
        log.info("Builds the department organization tree to which a member belongs after being isolated");
        // Gets a member's department and all sub-departments.
        List<TeamTreeVo> allTeamsVO = this.getMemberAllTeamsVO(spaceId, teamIds);
        //  Gets a member's department's and all sub-departments' id
        List<Long> teamIdList = allTeamsVO.stream().map(TeamTreeVo::getTeamId).collect(Collectors.toList());
        // Setting the id of the parent department to 0 is equivalent to raising the level of the directly affiliated department to the first-level department
        for (TeamTreeVo teamVO : allTeamsVO) {
            if (teamIds.contains(teamVO.getTeamId()) && !teamIdList.contains(teamVO.getParentId()) && teamVO.getParentId() != 0) {
                teamVO.setParentId(0L);
            }
        }
        return new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(allTeamsVO);
    }

    @Override
    public List<TeamTreeVo> getMemberAllTeamsVO(String spaceId, List<Long> teamIds) {
        log.info("Gets a member's department and all sub-departments.");
        // Gets a member's department's and all sub-departments' id
        List<TeamCteInfo> allTeamIds = teamMapper.selectChildTreeByTeamIds(spaceId, teamIds);
        return this.buildTree(spaceId, allTeamIds.stream().map(TeamCteInfo::getId).collect(Collectors.toList()));
    }

    @Override
    public List<TeamTreeVo> loadMemberTeamTree(String spaceId, Long memberId) {
        log.info("load the organization tree of member departments");
        // check whether members are isolated from contacts
        MemberIsolatedInfo memberIsolatedInfo = this.checkMemberIsolatedBySpaceId(spaceId, memberId);
        if (Boolean.TRUE.equals(memberIsolatedInfo.isIsolated())) {
            // get the department organization tree
            return this.getMemberTeamTree(spaceId, memberIsolatedInfo.getTeamIds());
        }
        // statistical space under all departments
        List<TeamTreeVo> treeList = this.build(spaceId, null);
        // build the default loaded organization tree
        List<TeamTreeVo> teamTreeVoList = new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(treeList);
        // root team id is deal with 0
        for (TeamTreeVo teamTreeVo : teamTreeVoList) {
            if (teamTreeVo.getParentId() == 0) {
                teamTreeVo.setTeamId(0L);
            }
        }
        return teamTreeVoList;
    }

    @Override
    public List<UnitTeamVo> getUnitTeamVo(String spaceId, List<Long> teamIds) {
        return baseMapper.selectUnitTeamVoByTeamIds(spaceId, teamIds);
    }

    @Override
    public void handlePageMemberTeams(IPage<MemberPageVo> page, String spaceId) {
        // get all member's id
        List<Long> memberIds = page.getRecords().stream().map(MemberPageVo::getMemberId).collect(Collectors.toList());
        // handle member's team name. get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap = this.batchGetFullHierarchyTeamNames(memberIds, spaceId);
        for (MemberPageVo memberPageVo : page.getRecords()) {
            if (memberToTeamPathInfoMap.containsKey(memberPageVo.getMemberId())) {
                memberPageVo.setTeamData(memberToTeamPathInfoMap.get(memberPageVo.getMemberId()));
            }
        }
    }

    @Override
    public void handleListMemberTeams(List<MemberInfoVo> memberInfoVos, String spaceId) {
        // get all member's id
        List<Long> memberIds = memberInfoVos.stream().map(MemberInfoVo::getMemberId).collect(Collectors.toList());
        // handle member's team name. get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap = this.batchGetFullHierarchyTeamNames(memberIds, spaceId);
        for (MemberInfoVo memberInfoVo : memberInfoVos) {
            if (memberToTeamPathInfoMap.containsKey(memberInfoVo.getMemberId())) {
                memberInfoVo.setTeamData(memberToTeamPathInfoMap.get(memberInfoVo.getMemberId()));
            }
        }
    }

    @Override
    public Map<Long, List<MemberTeamPathInfo>> batchGetFullHierarchyTeamNames(List<Long> memberIds, String spaceId) {
        if (CollUtil.isEmpty(memberIds)) {
            return new HashMap<>();
        }
        // batch get memberId and teamId
        List<MemberTeamInfoDTO> memberTeamInfoDTOS = memberMapper.selectTeamIdsByMemberIds(memberIds);
        // group by memberId
        Map<Long, List<Long>> memberTeamMap = memberTeamInfoDTOS.stream()
                .collect(Collectors.groupingBy(MemberTeamInfoDTO::getMemberId, Collectors.mapping(MemberTeamInfoDTO::getTeamId, Collectors.toList())));
        // get member's each full hierarchy team name
        Map<Long, List<String>> teamIdToPathMap = this.getMemberEachTeamPathName(memberTeamMap, spaceId);
        // build return object, each team's id and team's full hierarchy path name
        Map<Long, List<MemberTeamPathInfo>> memberToAllTeamPathNameMap = new HashMap<>();
        for (Entry<Long, List<Long>> entry : memberTeamMap.entrySet()) {
            List<MemberTeamPathInfo> memberTeamPathInfos = new ArrayList<>();
            for (Long teamId : entry.getValue()) {
                if (teamIdToPathMap.containsKey(teamId)) {
                    // build return team info and format team name
                    MemberTeamPathInfo memberTeamPathInfo = new MemberTeamPathInfo();
                    memberTeamPathInfo.setTeamId(teamId);
                    memberTeamPathInfo.setFullHierarchyTeamName(StrUtil.join("/", teamIdToPathMap.get(teamId)));
                    memberTeamPathInfos.add(memberTeamPathInfo);
                }
            }
            memberToAllTeamPathNameMap.put(entry.getKey(), memberTeamPathInfos);
        }
        return memberToAllTeamPathNameMap;
    }

    @Override
    public Map<Long, List<String>> getMemberEachTeamPathName(Map<Long, List<Long>> memberTeamMap, String spaceId) {
        // get all teamIds
        Set<Long> allTeamIds = new HashSet<>();
        for (Entry<Long, List<Long>> entry : memberTeamMap.entrySet()) {
            allTeamIds.addAll(entry.getValue());
        }
        // get member's team's all parent team, include itself
        List<TeamPathInfo> teamPathInfos = teamMapper.selectParentTreeByTeamIds(spaceId, new ArrayList<>(allTeamIds));
        List<TeamTreeVo> teamTreeVos = this.buildTree(spaceId, teamPathInfos.stream().map(TeamCteInfo::getId).collect(Collectors.toList()));
        // build team tree
        List<TeamTreeVo> treeVos = new DefaultTreeBuildFactory<TeamTreeVo>().doTreeBuild(teamTreeVos);
        Map<Long, List<String>> teamIdToPathMap = new HashMap<>();
        // TODO:optimize just recurse first level nodeId
        for (TeamTreeVo treeVo : treeVos) {
            // current team full hierarchy team name
            List<String> teamNames = new ArrayList<>();
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
                this.recurseGetBranchAllTeamIdsAndTeamNames(treeVo.getChildren(), teamVos, allTeamIds, teamNames, teamIdToPathMap);
            }
        }
        return teamIdToPathMap;
    }

    /**
     * recurse get member's teamId and teamName
     *
     * @param treeVo team tree view
     * @param teamVos team's view
     * @param allTeamIds member's all teamIds
     * @param teamNames member's team path name
     * @param teamIdToPathMap memberId with member's team name map
     */
    private void recurseGetBranchAllTeamIdsAndTeamNames(List<TeamTreeVo> treeVo, List<TeamVo> teamVos, Set<Long> allTeamIds, List<String> teamNames, Map<Long, List<String>> teamIdToPathMap) {
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
                recurseGetBranchAllTeamIdsAndTeamNames(team.getChildren(), teamVos, allTeamIds, branchNames, teamIdToPathMap);
            }
        }
    }

    /**
     * recursive processing
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
     * get child nodes
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
