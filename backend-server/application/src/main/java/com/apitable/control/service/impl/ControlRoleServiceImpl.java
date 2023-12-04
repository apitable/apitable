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

package com.apitable.control.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.control.entity.ControlRoleEntity;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.control.mapper.ControlRoleMapper;
import com.apitable.control.service.IControlRoleService;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.workspace.dto.ControlRoleInfo;
import com.apitable.workspace.dto.ControlRoleUnitDTO;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Permission control unit role service implementation class.
 * </p>
 */
@Slf4j
@Service
public class ControlRoleServiceImpl extends ServiceImpl<ControlRoleMapper, ControlRoleEntity>
    implements IControlRoleService {

    @Resource
    private ControlRoleMapper controlRoleMapper;

    @Override
    public List<ControlRoleEntity> getByControlId(String controlId) {
        log.info("Get all role information of control unit 「{}」", controlId);
        return controlRoleMapper.selectByControlId(controlId);
    }

    @Override
    public List<ControlRoleEntity> getByControlIdAndUnitId(String controlId, Long unitId) {
        log.info("Get all role information of control unit 「{}」organizational unit 「{}」", controlId,
            unitId);
        return controlRoleMapper.selectByControlIdAndUnitId(controlId, unitId);
    }

    @Override
    public Long getUnitIdByControlIdAndRoleCode(String controlId, String roleCode) {
        log.info("Get the organization unit whose control unit 「{}」 role code is 「{}」", controlId,
            roleCode);
        return controlRoleMapper.selectUnitIdAndControlIdAndRoleCode(controlId, roleCode);
    }

    @Override
    public String getRoleCodeByControlIdAndUnitId(String controlId, Long unitId) {
        log.info("Get the role code of control unit 「{}」organizational unit 「{}」", controlId,
            unitId);
        return controlRoleMapper.selectRoleCodeByControlIdAndUnitId(controlId, unitId);
    }

    @Override
    public List<ControlRoleInfo> getUnitRoleByControlIdAndUnitIds(String controlId,
                                                                  List<Long> unitIds) {
        log.info("Get the role code of control unit 「{}」 organizational unit 「{}」", controlId,
            unitIds);
        return controlRoleMapper.selectControlRoleInfoByControlIdAndUnitIds(controlId, unitIds);
    }

    @Override
    public List<ControlRoleInfo> getUnitRoleByControlId(String controlId) {
        log.info("Get the role information of control unit 「{}」", controlId);
        return controlRoleMapper.selectControlRoleInfoByControlIds(
            Collections.singletonList(controlId));
    }

    @Override
    public List<ControlRoleUnitDTO> getControlRolesUnitDtoByControlId(String controlId) {
        log.info("Get the role and organizational unit information of control unit 「{}」",
            controlId);
        return controlRoleMapper.selectControlRoleUnitDtoByControlId(controlId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addControlRole(Long userId, String controlId, List<Long> unitIds, String role) {
        log.info("New control unit role。userId:{},controlId:{},role:{},unitIds:{}", userId,
            controlId, role, unitIds);
        List<ControlRoleEntity> entities = new ArrayList<>();
        List<Long> updateIds = new ArrayList<>();
        List<Long> insertUnitIds = new ArrayList<>(unitIds);
        // modify former deleted status
        List<ControlRoleEntity> deletedEntities =
            controlRoleMapper.selectDeletedRole(controlId, unitIds, role);
        deletedEntities.forEach(entity -> {
            updateIds.add(entity.getId());
            // Delete exist
            insertUnitIds.remove(entity.getUnitId());
        });
        new HashSet<>(insertUnitIds).forEach(unitId -> entities.add(ControlRoleEntity.builder()
            .id(IdWorker.getId())
            .controlId(controlId)
            .unitId(unitId)
            .roleCode(role)
            .createdBy(userId)
            .updatedBy(userId)
            .build()));
        if (!entities.isEmpty()) {
            boolean flag = SqlHelper.retBool(controlRoleMapper.insertBatch(entities));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
        if (!updateIds.isEmpty()) {
            boolean flag =
                SqlHelper.retBool(controlRoleMapper.updateIsDeletedByIds(userId, updateIds, false));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
    }

    @Override
    public void addControlRole(Long userId, String controlId, Map<Long, String> unitRoleMap) {
        log.info("「{}」Add the organizational unit role set of control unit 「{}」", userId,
            controlId);
        List<Long> unitIds = ListUtil.toList(unitRoleMap.keySet());
        List<String> roleCodes = ListUtil.toList((unitRoleMap.values()));
        // modify former deleted status
        List<ControlRoleEntity> deletedEntities =
            controlRoleMapper.selectDeletedRoleByRoleCodes(controlId,
                unitIds, roleCodes);
        List<Long> updateIds = new ArrayList<>();
        deletedEntities.forEach(entity -> {
            updateIds.add(entity.getId());
            Long unitId = entity.getUnitId();
            if (unitRoleMap.get(unitId).equals(entity.getRoleCode())) {
                unitRoleMap.remove(unitId);
            }
        });
        List<ControlRoleEntity> entities = new ArrayList<>();
        unitRoleMap.forEach((unitId, role) -> entities.add(ControlRoleEntity.builder()
            .id(IdWorker.getId())
            .controlId(controlId)
            .unitId(unitId)
            .roleCode(role)
            .createdBy(userId)
            .updatedBy(userId)
            .build()));
        if (!entities.isEmpty()) {
            boolean flag = SqlHelper.retBool(controlRoleMapper.insertBatch(entities));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
        if (!updateIds.isEmpty()) {
            boolean flag =
                SqlHelper.retBool(controlRoleMapper.updateIsDeletedByIds(userId, updateIds, false));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void editControlRole(Long userId, String controlId, List<Long> unitIds, String role) {
        if (CollUtil.isEmpty(unitIds)) {
            return;
        }
        log.info("「{}」 modifies the role of control unit 「{}」 organizational unit 「{}」 to 「{}」",
            userId, controlId, unitIds, role);
        List<ControlRoleEntity> controlRoles =
            controlRoleMapper.selectByControlIdAndUnitIds(controlId, unitIds, true);
        if (controlRoles.isEmpty()) {
            addControlRole(userId, controlId, unitIds, role);
            return;
        }
        Map<Long, Map<String, ControlRoleEntity>> unitRoleMap =
            controlRoles.stream().collect(Collectors.groupingBy(ControlRoleEntity::getUnitId,
                Collectors.toMap(ControlRoleEntity::getRoleCode, Function.identity())));
        List<Long> recoverIds = new ArrayList<>();
        List<Long> deleteIds = new ArrayList<>();
        List<Long> addControlRoleUnitIds = new ArrayList<>();
        for (Long unitId : unitIds) {
            if (unitRoleMap.containsKey(unitId)) {
                Set<String> roleCodes = unitRoleMap.get(unitId).keySet();
                // No permission
                if (!roleCodes.contains(role)) {
                    addControlRoleUnitIds.add(unitId);
                } else {
                    // This permission was previously deleted
                    if (unitRoleMap.get(unitId).get(role).getIsDeleted()) {
                        recoverIds.add(unitRoleMap.get(unitId).get(role).getId());
                    }
                }
                // If you have this permission before, delete other undeleted permissions except this permission
                deleteIds.addAll(roleCodes.stream().filter(
                        i -> !unitRoleMap.get(unitId).get(i).getRoleCode().equals(role)
                            && !unitRoleMap.get(unitId).get(i).getIsDeleted())
                    .map(i -> unitRoleMap.get(unitId).get(i).getId()).collect(Collectors.toList()));
            }
        }
        editIsDeletedByIds(recoverIds, userId, false);
        editIsDeletedByIds(deleteIds, userId, true);
        if (!addControlRoleUnitIds.isEmpty()) {
            addControlRole(userId, controlId, new ArrayList<>(addControlRoleUnitIds), role);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeByControlIds(Long userId, List<String> controlIds) {
        log.info("Delete all roles of the specified control unit「{}」", controlIds);
        // Query primary key ID
        List<Long> controlRoleIds = controlRoleMapper.selectIdByControlIds(controlIds);
        // Logical delete
        removeByIds(controlRoleIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeByUnitIds(List<Long> unitIds) {
        log.info("Delete all roles of the specified organizational unit「{}」", unitIds);
        // Query primary key ID
        List<Long> controlRoleIds = controlRoleMapper.selectIdByUnitIds(unitIds);
        // Logical delete
        removeByIds(controlRoleIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeByControlIdAndUnitId(String controlId, Long unitId) {
        log.info("Delete the role of organizational unit 「{}」 under control unit 「{}」", controlId,
            unitId);
        List<Long> controlRoleIds =
            controlRoleMapper.selectIdByControlIdAndUnitId(controlId, unitId);
        boolean flag = removeByIds(controlRoleIds);
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeByControlIdAndUnitIds(String controlId, List<Long> unitIds) {
        log.info("Delete the role of organizational unit 「{}」 under control unit 「{}」", controlId,
            unitIds);
        List<Long> controlRoleIds =
            controlRoleMapper.selectIdByControlIdAndUnitIds(controlId, unitIds);
        boolean flag = removeByIds(controlRoleIds);
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }

    @Override
    public void editIsDeletedByIds(List<Long> ids, Long userId, boolean isDeleted) {
        if (CollUtil.isEmpty(ids)) {
            return;
        }
        controlRoleMapper.updateIsDeletedByIds(userId, ids, isDeleted);
    }

    @Override
    public Map<Long, String> getUnitIdToRoleCodeMapWithoutOwnerRole(String controlId,
                                                                    List<Long> unitIds) {
        log.info("Get all role information of control unit 「{}」 organizational unit 「{}」",
            controlId, unitIds);
        List<ControlRoleEntity> controlRoles =
            controlRoleMapper.selectByControlIdAndUnitIds(controlId, unitIds, false);
        Map<Long, String> unitIdToCodeRole = new HashMap<>(unitIds.size());
        controlRoles.stream()
            .filter(controlRole -> !controlRole.getRoleCode().equals(Node.OWNER))
            .forEach(controlRole -> unitIdToCodeRole.put(controlRole.getUnitId(),
                controlRole.getRoleCode()));
        return unitIdToCodeRole;
    }
}
