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

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.organization.dto.RoleBaseInfoDto;
import com.apitable.organization.dto.RoleMemberDTO;
import com.apitable.organization.dto.RoleMemberInfoDTO;
import com.apitable.organization.dto.UnitBaseInfoDTO;
import com.apitable.organization.entity.RoleMemberEntity;
import com.apitable.organization.entity.TeamEntity;
import com.apitable.organization.enums.OrganizationException;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.mapper.RoleMemberMapper;
import com.apitable.organization.ro.RoleMemberUnitRo;
import com.apitable.organization.service.IOrganizationService;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.organization.vo.RoleMemberVo;
import com.apitable.organization.vo.UnitMemberVo;
import com.apitable.organization.vo.UnitRoleInfoVo;
import com.apitable.organization.vo.UnitTeamVo;
import com.apitable.space.service.ISpaceService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * role member service impl.
 * </p>
 */
@Slf4j
@Service
public class RoleMemberServiceImpl extends ServiceImpl<RoleMemberMapper, RoleMemberEntity>
    implements IRoleMemberService {

    @Resource
    private IOrganizationService iOrganizationService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IRoleService iRoleService;

    @Resource
    private IUnitService iUnitService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<Long> addRoleMembers(Long roleId, List<RoleMemberUnitRo> unitList) {
        // filter exist role members.
        Set<Long> existRoleMembers = baseMapper.selectUnitRefIdsByRoleId(roleId);
        List<RoleMemberUnitRo> distinctUnits =
            unitList.stream().filter(orgUnit -> !existRoleMembers.contains(orgUnit.getId()))
                .collect(toList());
        if (CollUtil.isEmpty(distinctUnits)) {
            return CollUtil.newArrayList();
        }
        List<RoleMemberEntity> roleMembers = new ArrayList<>(distinctUnits.size());
        List<Long> teamIds = new ArrayList<>();
        List<Long> memberIds = new ArrayList<>();
        // add role members begin.
        distinctUnits.forEach(unit -> {
            RoleMemberEntity roleMember = RoleMemberEntity.builder()
                .roleId(roleId)
                .unitRefId(unit.getId())
                .unitType(unit.getType())
                .build();
            roleMembers.add(roleMember);
            List<Long> ids = UnitType.TEAM.getType().equals(unit.getType()) ? teamIds : memberIds;
            ids.add(unit.getId());
        });
        boolean flag = saveBatch(roleMembers);
        ExceptionUtil.isTrue(flag, OrganizationException.ADD_ROLE_MEMBER_ERROR);
        return getMemberIds(teamIds, memberIds);
    }

    @Override
    public List<Long> removeByRoleIdAndRoleMemberIds(Long roleId, List<Long> roleMemberIds) {
        if (CollUtil.isEmpty(roleMemberIds)) {
            return CollUtil.newArrayList();
        }
        List<RoleMemberInfoDTO> removedRoleMember =
            baseMapper.selectRoleMembersByRoleIdAndUnitRefIds(roleId, roleMemberIds);
        // begin remove role members.
        baseMapper.deleteByRoleIdAndUnitRefIds(roleId, roleMemberIds);
        return getMemberIds(removedRoleMember);
    }

    @Override
    public void removeByRoleId(Long roleId) {
        baseMapper.deleteByRoleId(roleId);
    }

    @Override
    public List<RoleMemberInfoDTO> getRoleMembersByRoleIds(List<Long> roleIds) {
        if (CollUtil.isEmpty(roleIds)) {
            return CollUtil.newArrayList();
        }
        return baseMapper.selectRoleMembersByRoleIds(roleIds);
    }

    @Override
    public IPage<RoleMemberVo> getRoleMembersPage(String spaceId, Long roleId, Page<Void> page) {
        // page query role members' information.
        IPage<RoleMemberInfoDTO> roleMemberUnitPage =
            baseMapper.selectRoleMembersByRoleId(roleId, page);
        // populate role member vo information begins.
        IPage<RoleMemberVo> roleMembersPage = roleMemberUnitPage
            .convert(roleMemberUnit -> RoleMemberVo.builder()
                .unitRefId(roleMemberUnit.getUnitRefId())
                .unitType(roleMemberUnit.getUnitType())
                .build());
        List<RoleMemberVo> records = roleMembersPage.getRecords();
        // populate role member vo information based on the type of the role member.
        populateRoleMember(spaceId, records);
        return roleMembersPage;
    }

    private void populateRoleMember(String spaceId, List<RoleMemberVo> records) {
        Map<Long, RoleMemberVo> unitRefIdToRoleMember = records.stream()
            .collect(toMap(RoleMemberVo::getUnitRefId, record -> record));
        Map<Integer, List<Long>> unitTypeToUnitRefId = records.stream()
            .collect(groupingBy(RoleMemberVo::getUnitType,
                mapping(RoleMemberVo::getUnitRefId, toList())));
        unitTypeToUnitRefId.forEach((unitType, unitRefIds) -> {
            if (UnitType.TEAM.getType().equals(unitType)) {
                // populate team type role members
                populateTeam(spaceId, unitRefIdToRoleMember, unitRefIds);
                return;
            }
            // populate member type role members
            populateMember(spaceId, unitRefIdToRoleMember, unitRefIds);
        });
    }

    private void populateMember(String spaceId, Map<Long, RoleMemberVo> unitRefIdToRoleMember,
                                List<Long> unitRefIds) {
        // get root team's name
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        TeamEntity team = iTeamService.getById(rootTeamId);
        String rootTeamName = team.getTeamName();
        // get member information by member id.
        List<UnitMemberVo> unitMembers = iOrganizationService.findUnitMemberVo(unitRefIds);
        unitMembers.forEach(unitMember -> {
            Long memberId = unitMember.getMemberId();
            RoleMemberVo roleMember = unitRefIdToRoleMember.get(memberId);
            roleMember.setUnitId(unitMember.getUnitId());
            roleMember.setUnitName(unitMember.getMemberName());
            roleMember.setAvatar(unitMember.getAvatar());
            roleMember.setAvatarColor(unitMember.getAvatarColor());
            roleMember.setNickName(unitMember.getNickName());
            roleMember.setIsAdmin(unitMember.getIsAdmin());
            if (StrUtil.isNotBlank(unitMember.getTeams())) {
                roleMember.setTeams(unitMember.getTeams());
            } else {
                roleMember.setTeams(rootTeamName);
            }
        });
        Long mainAdmin = iSpaceService.getSpaceMainAdminMemberId(spaceId);
        if (unitRefIdToRoleMember.containsKey(mainAdmin)) {
            // if exist member is main admin, flag it.
            RoleMemberVo mainAdminRoleMember = unitRefIdToRoleMember.get(mainAdmin);
            mainAdminRoleMember.setIsMainAdmin(true);
        }
    }

    private void populateTeam(String spaceId, Map<Long, RoleMemberVo> unitRefIdToRoleMember,
                              List<Long> unitRefIds) {
        // get team information by team id.
        List<UnitTeamVo> unitTeams = iTeamService.getUnitTeamVo(spaceId, unitRefIds);
        unitTeams.forEach(unitTeam -> {
            Long teamId = unitTeam.getTeamId();
            RoleMemberVo roleMember = unitRefIdToRoleMember.get(teamId);
            roleMember.setUnitId(unitTeam.getUnitId());
            roleMember.setUnitName(unitTeam.getTeamName());
            // query the team's member amount.
            long memberCount = iTeamService.getMemberCount(CollUtil.newArrayList(teamId));
            roleMember.setMemberCount(memberCount);
        });
    }

    @Override
    public void removeByRoleMemberIds(Collection<Long> roleMemberIds) {
        if (CollUtil.isEmpty(roleMemberIds)) {
            return;
        }
        baseMapper.deleteByUnitRefIds(roleMemberIds);
    }

    @Override
    public List<Long> getRoleIdsByRoleMemberId(Long memberId) {
        return baseMapper.selectRoleIdsByUnitRefId(memberId);
    }

    @Override
    public List<Long> getMemberIdsByRoleIds(List<Long> roleIds) {
        if (CollUtil.isEmpty(roleIds)) {
            return CollUtil.newArrayList();
        }
        List<RoleMemberInfoDTO> roleMembers = baseMapper.selectRoleMembersByRoleIds(roleIds);
        return getMemberIds(roleMembers);
    }

    @Override
    public void checkRoleMemberExistByRoleId(Long roleId, Consumer<Boolean> consumer) {
        int count = SqlTool.retCount(baseMapper.selectCountByRoleId(roleId));
        consumer.accept(count > 0);
    }

    @Override
    public List<RoleMemberDTO> getByUnitRefIdsAndUnitType(List<Long> unitRefIds,
                                                          UnitType unitType) {
        if (unitRefIds.isEmpty()) {
            return new ArrayList<>();
        }
        return baseMapper.selectByUnitRefIdAnUnitType(unitRefIds, unitType);
    }

    @Override
    public List<RoleMemberDTO> getByRoleIds(List<Long> unitRefIds) {
        if (unitRefIds.isEmpty()) {
            return new ArrayList<>();
        }
        return baseMapper.selectByRoleIds(unitRefIds);
    }

    @Override
    public Map<Long, List<UnitRoleInfoVo>> getRefUnitRoles(List<Long> unitRefIds,
                                                           UnitType unitType) {
        // get the specific unit's roles
        List<RoleMemberDTO> refRoles = getByUnitRefIdsAndUnitType(unitRefIds, unitType);
        if (refRoles.isEmpty()) {
            return new HashMap<>();
        }
        // get role information, group by roleId
        List<Long> roleIds = refRoles.stream().map(RoleMemberDTO::getRoleId).collect(toList());
        Map<Long, RoleBaseInfoDto> roleMap = iRoleService.getBaseInfoDtoByRoleIds(roleIds).stream()
            .collect(Collectors.toMap(RoleBaseInfoDto::getId, i -> i));
        // get role unit information, group by roleId
        Map<Long, String> units = iUnitService.getUnitBaseInfoByRefIds(roleIds).stream()
            .collect(Collectors.toMap(UnitBaseInfoDTO::getUnitRefId, UnitBaseInfoDTO::getUnitId));
        // return information, group by unitRefId (team/member)
        Map<Long, List<UnitRoleInfoVo>> refUnitRoleMap = new HashMap<>();
        for (RoleMemberDTO refRole : refRoles) {
            RoleBaseInfoDto role = roleMap.get(refRole.getRoleId());
            UnitRoleInfoVo unitRole = UnitRoleInfoVo.builder().unitId(units.get(role.getId()))
                .sequence(role.getPosition()).name(role.getRoleName()).build();
            if (refUnitRoleMap.containsKey(refRole.getUnitRefId())) {
                List<UnitRoleInfoVo> unitRoles =
                    new ArrayList<>(refUnitRoleMap.get(refRole.getUnitRefId()));
                unitRoles.add(unitRole);
                refUnitRoleMap.put(refRole.getUnitRefId(), unitRoles);
            } else {
                refUnitRoleMap.put(refRole.getUnitRefId(), Collections.singletonList(unitRole));
            }
        }
        return refUnitRoleMap;

    }

    private List<Long> getMemberIds(List<RoleMemberInfoDTO> roleMembers) {
        List<Long> teamIds = new ArrayList<>();
        List<Long> memberIds = new ArrayList<>();
        roleMembers.forEach(roleMember -> {
            List<Long> ids =
                UnitType.toEnum(roleMember.getUnitType()) == UnitType.TEAM ? teamIds : memberIds;
            ids.add(roleMember.getUnitRefId());
        });
        return getMemberIds(teamIds, memberIds);
    }

    private List<Long> getMemberIds(List<Long> teamIds, List<Long> memberIds) {
        if (CollUtil.isNotEmpty(teamIds)) {
            List<Long> teamMemberIds = iTeamService.getMemberIdsByTeamIds(teamIds);
            return CollUtil.newArrayList(CollUtil.unionDistinct(memberIds, teamMemberIds));
        }
        return memberIds;
    }

}
