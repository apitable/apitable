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

import static com.apitable.organization.enums.OrganizationException.NOT_EXIST_ROLE;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.organization.dto.RoleBaseInfoDto;
import com.apitable.organization.dto.RoleInfoDTO;
import com.apitable.organization.dto.RoleMemberInfoDTO;
import com.apitable.organization.dto.UnitBaseInfoDTO;
import com.apitable.organization.dto.UnitRoleInfoDTO;
import com.apitable.organization.entity.RoleEntity;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.OrganizationException;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.mapper.RoleMapper;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.organization.vo.RoleInfoVo;
import com.apitable.organization.vo.RoleVo;
import com.apitable.shared.sysconfig.i18n.I18nStringsUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Role service implement.
 */
@Slf4j
@Service
public class RoleServiceImpl extends ServiceImpl<RoleMapper, RoleEntity> implements IRoleService {

    @Resource
    IUnitService iUnitService;

    @Resource
    IRoleMemberService iRoleMemberService;

    @Resource
    ITeamService iTeamService;

    @Override
    public void checkDuplicationRoleName(String spaceId, String roleName,
                                         Consumer<Boolean> consumer) {
        int count = SqlTool.retCount(baseMapper.selectCountBySpaceIdAndRoleName(spaceId, roleName));
        consumer.accept(count > 0);
    }

    @Override
    public void checkDuplicationRoleName(String spaceId, Long roleId, String roleName,
                                         Consumer<Boolean> consumer) {
        int count = SqlTool.retCount(
            baseMapper.selectCountBySpaceIdAndRoleNameWithExceptId(spaceId, roleId, roleName));
        consumer.accept(count > 0);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createRole(Long userId, String spaceId, String roleName) {
        log.info("create role: {}", roleName);
        UnitRoleInfoDTO role =
            createRole(userId, spaceId, roleName, getSequenceBySpaceId(spaceId));
        return role.getRoleId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UnitRoleInfoDTO createRole(Long userId, String spaceId, String roleName,
                                      Integer position) {
        log.info("create role: {}", roleName);
        RoleEntity role = new RoleEntity();
        role.setSpaceId(spaceId);
        role.setRoleName(roleName);
        role.setPosition(null == position ? getSequenceBySpaceId(spaceId) : position);
        role.setCreateBy(userId);
        boolean flag = save(role);
        ExceptionUtil.isTrue(flag, OrganizationException.CREATE_ROLE_ERROR);
        UnitEntity unit = iUnitService.create(spaceId, UnitType.ROLE, role.getId());
        return UnitRoleInfoDTO.builder().roleId(role.getId()).roleName(roleName)
            .position(role.getPosition()).unitId(unit.getUnitId()).build();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateRole(Long userId, Long roleId, String roleName) {
        updateRole(userId, roleId, roleName, null);
    }

    @Override
    public void updateRole(Long userId, Long roleId, String roleName, Integer position) {
        log.info("modify role's information");
        RoleEntity role = baseMapper.selectById(roleId);
        role.setUpdateBy(userId);
        if (StrUtil.isNotEmpty(roleName)) {
            role.setRoleName(roleName);
        }
        if (null != position) {
            role.setPosition(position);
        }
        boolean flag = updateById(role);
        ExceptionUtil.isTrue(flag, OrganizationException.UPDATE_ROLE_NAME_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteRole(Long roleId) {
        // clear role's member
        iRoleMemberService.removeByRoleId(roleId);
        // delete the ref unit and control role.
        iUnitService.removeByRefId(roleId);
        // delete the role.
        boolean flag = removeById(roleId);
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }

    @Override
    public void checkRoleExistBySpaceIdAndRoleId(String spaceId, Long roleId,
                                                 Consumer<Boolean> consumer) {
        int count = SqlTool.retCount(baseMapper.selectCountByIdAndSpaceId(roleId, spaceId));
        consumer.accept(count > 0);
    }

    @Override
    public List<RoleInfoVo> getRoles(String spaceId) {
        List<RoleInfoVo> roles = new ArrayList<>();
        // 1. query the space's roles.
        List<RoleInfoDTO> roleInfos = baseMapper.selectBySpaceId(spaceId);
        if (CollUtil.isEmpty(roleInfos)) {
            return roles;
        }
        // 2. populate role vo.
        roleInfos.forEach(roleInfo -> {
            // populate role information.
            RoleInfoVo role = RoleInfoVo.builder()
                .unitId(roleInfo.getUnitId())
                .roleId(roleInfo.getId())
                .roleName(roleInfo.getRoleName())
                .position(roleInfo.getPosition())
                .memberCount(0L)
                .build();
            roles.add(role);
        });
        // 3. the number of members in the roles.
        roleFillMemberCount(roles, roleInfos);
        return roles;
    }

    @Override
    public String getRoleNameByRoleId(Long roleId) {
        return baseMapper.selectRoleNameById(roleId);
    }

    @Override
    public List<RoleVo> getRoleVosByMemberId(Long memberId) {
        List<Long> roleIds = iRoleMemberService.getRoleIdsByRoleMemberId(memberId);
        if (CollUtil.isEmpty(roleIds)) {
            return CollUtil.newArrayList();
        }
        List<RoleInfoDTO> roleInfos = baseMapper.selectRoleInfoDtoByIds(roleIds);
        return roleInfos.stream()
            .map(roleInfo -> RoleVo.builder()
                .roleId(roleInfo.getId())
                .roleName(roleInfo.getRoleName())
                .build())
            .collect(toList());
    }

    @Override
    public List<Long> getRoleIdsByKeyWord(String spaceId, String keyword) {
        return baseMapper.selectIdsBySpaceIdAndLikeRoleName(spaceId, keyword);
    }

    @Override
    public List<RoleBaseInfoDto> getBaseInfoDtoByRoleIds(List<Long> roleIds) {
        return baseMapper.selectRoleBaseInfoDtoByIds(roleIds);
    }

    @Override
    public Map<Long, List<Long>> flatMapToRoleMemberUnitIds(List<Long> roleIds) {
        if (CollUtil.isEmpty(roleIds)) {
            return new HashMap<>(0);
        }
        List<RoleMemberInfoDTO> roleMembers = iRoleMemberService.getRoleMembersByRoleIds(roleIds);
        List<UnitEntity> roleUnits = iUnitService.getUnitEntitiesByUnitRefIds(roleIds);
        Map<Long, List<Long>> roleIdToUnitIds = roleMembers.stream().collect(
            groupingBy(RoleMemberInfoDTO::getRoleId,
                mapping(RoleMemberInfoDTO::getUnitId, toList())));
        return roleUnits.stream().collect(toMap(UnitEntity::getId,
            unit -> roleIdToUnitIds.getOrDefault(unit.getUnitRefId(), CollUtil.newArrayList())));
    }

    @Override
    public List<RoleInfoVo> getRoleVos(String spaceId, List<Long> roleIds) {
        // 1. query the space's roles.
        List<RoleInfoDTO> roleInfoDtos =
            baseMapper.selectRoleInfoDtoByIdsAndSpaceId(roleIds, spaceId);
        List<RoleInfoVo> roleInfoVos = new ArrayList<>(roleInfoDtos.size());
        roleInfoDtos.forEach(roleInfoDTO -> {
            RoleInfoVo roleInfoVo = RoleInfoVo.builder()
                .unitId(roleInfoDTO.getUnitId())
                .roleId(roleInfoDTO.getId())
                .roleName(roleInfoDTO.getRoleName())
                .position(roleInfoDTO.getPosition())
                .build();
            roleInfoVos.add(roleInfoVo);
        });
        roleFillMemberCount(roleInfoVos, roleInfoDtos);
        return roleInfoVos;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void initRoleList(Long userId, String spaceId) {
        List<String> roleNames = getInitRoleNames();
        if (roleNames.isEmpty()) {
            return;
        }
        List<RoleEntity> roles = new ArrayList<>();
        for (int i = 0; i < roleNames.size(); i++) {
            String roleName = roleNames.get(i);
            RoleEntity role = RoleEntity.builder()
                .spaceId(spaceId)
                .roleName(roleName)
                .position(1000 * (2 << i))
                .createBy(userId)
                .build();
            roles.add(role);
        }
        boolean flag = saveBatch(roles);
        ExceptionUtil.isTrue(flag, OrganizationException.CREATE_ROLE_ERROR);
        List<UnitEntity> units = new ArrayList<>();
        for (RoleEntity role : roles) {
            UnitEntity unit = UnitEntity.builder()
                .spaceId(spaceId)
                .unitId(IdUtil.fastSimpleUUID())
                .unitRefId(role.getId())
                .unitType(UnitType.ROLE.getType())
                .build();
            units.add(unit);
        }
        boolean unitsInsertFlag = iUnitService.createBatch(units);
        ExceptionUtil.isTrue(unitsInsertFlag, OrganizationException.CREATE_ROLE_ERROR);
    }

    @Override
    public void checkRoleExistBySpaceId(String spaceId, Consumer<Boolean> consumer) {
        int count = SqlTool.retCount(baseMapper.selectCountBySpaceId(spaceId));
        consumer.accept(count > 0);
    }

    @Override
    public List<Long> getRoleIdsByUnitIds(String spaceId, List<String> unitIds) {
        if (unitIds.isEmpty()) {
            return new ArrayList<>();
        }
        return iUnitService.getUnitBaseInfoBySpaceIdAndUnitTypeAndUnitIds(spaceId, UnitType.ROLE,
            unitIds).stream().map(UnitBaseInfoDTO::getUnitRefId).collect(toList());
    }

    @Override
    public Long getRoleIdByUnitId(String spaceId, String unitId) {
        Long roleId =
            iUnitService.getUnitRefIdByUnitIdAndSpaceIdAndUnitType(unitId, spaceId, UnitType.ROLE);
        ExceptionUtil.isNotNull(roleId, NOT_EXIST_ROLE);
        return roleId;
    }

    private List<String> getInitRoleNames() {
        String roles = I18nStringsUtil.t("init_roles");
        return StrUtil.splitTrim(roles, StrUtil.C_COMMA);
    }

    private void roleFillMemberCount(List<RoleInfoVo> roles, List<RoleInfoDTO> roleInfos) {
        List<Long> roleIds = roleInfos.stream().map(RoleInfoDTO::getId).collect(toList());
        List<RoleMemberInfoDTO> allRoleMembers =
            iRoleMemberService.getRoleMembersByRoleIds(roleIds);
        if (CollUtil.isEmpty(allRoleMembers)) {
            return;
        }
        // group roles' members by role.
        Map<Long, List<RoleMemberInfoDTO>> roleIdToRoleMembers = allRoleMembers.stream()
            .collect(groupingBy(RoleMemberInfoDTO::getRoleId, toList()));
        roles.forEach(role -> {
            if (!roleIdToRoleMembers.containsKey(role.getRoleId())) {
                return;
            }
            // count the number of members in the role
            List<RoleMemberInfoDTO> roleMembers = roleIdToRoleMembers.get(role.getRoleId());
            Map<Integer, List<Long>> unitTypeToUnitRefIds = roleMembers.stream()
                .collect(groupingBy(RoleMemberInfoDTO::getUnitType,
                    mapping(RoleMemberInfoDTO::getUnitRefId, toList())));
            List<Long> memberIds = unitTypeToUnitRefIds
                .getOrDefault(UnitType.MEMBER.getType(), CollUtil.newArrayList());
            int memberCount;
            if (unitTypeToUnitRefIds.containsKey(UnitType.TEAM.getType())) {
                List<Long> teamIds = unitTypeToUnitRefIds.get(UnitType.TEAM.getType());
                List<Long> teamMemberIds = iTeamService.getMemberIdsByTeamIds(teamIds);
                memberCount = CollUtil.unionDistinct(memberIds, teamMemberIds).size();
            } else {
                memberCount = memberIds.size();
            }
            role.setMemberCount((long) memberCount);
        });
    }

    private int getSequenceBySpaceId(String spaceId) {
        Integer maxSequence = baseMapper.selectMaxSequenceBySpaceId(spaceId);
        return ObjectUtil.isNull(maxSequence) ? 1000 : maxSequence + 100;
    }

}
