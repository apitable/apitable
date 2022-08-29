package com.vikadata.api.modular.control.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.modular.control.mapper.ControlRoleMapper;
import com.vikadata.api.modular.control.service.IControlRoleService;
import com.vikadata.api.modular.workspace.model.ControlRoleInfo;
import com.vikadata.api.modular.workspace.model.ControlRoleUnitDTO;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.ControlRoleEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 权限控制单元角色 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2021/4/27
 */
@Slf4j
@Service
public class ControlRoleServiceImpl extends ServiceImpl<ControlRoleMapper, ControlRoleEntity> implements IControlRoleService {

    @Resource
    private ControlRoleMapper controlRoleMapper;

    @Override
    public List<ControlRoleEntity> getByControlId(String controlId) {
        log.info("获取控制单元「{}」的所有角色信息", controlId);
        return controlRoleMapper.selectByControlId(controlId);
    }

    @Override
    public List<ControlRoleEntity> getByControlIdAndUnitId(String controlId, Long unitId) {
        log.info("获取控制单元「{}」组织单元「{}」的所有角色信息", controlId, unitId);
        return controlRoleMapper.selectByControlIdAndUnitId(controlId, unitId);
    }

    @Override
    public Long getUnitIdByControlIdAndRoleCode(String controlId, String roleCode) {
        log.info("获取控制单元「{}」角色编码为「{}」的组织单元", controlId, roleCode);
        return controlRoleMapper.selectUnitIdAndControlIdAndRoleCode(controlId, roleCode);
    }

    @Override
    public String getRoleCodeByControlIdAndUnitId(String controlId, Long unitId) {
        log.info("获取控制单元「{}」组织单元「{}」的角色编码", controlId, unitId);
        return controlRoleMapper.selectRoleCodeByControlIdAndUnitId(controlId, unitId);
    }

    @Override
    public List<ControlRoleInfo> getUnitRoleByControlIdAndUnitIds(String controlId, List<Long> unitIds) {
        log.info("获取控制单元「{}」组织单元「{}」的角色编码", controlId, unitIds);
        return controlRoleMapper.selectControlRoleInfoByControlIdAndUnitIds(controlId, unitIds);
    }

    @Override
    public List<ControlRoleInfo> getUnitRoleByControlId(String controlId) {
        log.info("获取控制单元「{}」的角色信息", controlId);
        return controlRoleMapper.selectControlRoleInfoByControlIds(Collections.singletonList(controlId));
    }

    @Override
    public List<ControlRoleUnitDTO> getControlRolesUnitDtoByControlId(String controlId) {
        log.info("获取控制单元「{}」的角色及组织单元信息", controlId);
        return controlRoleMapper.selectControlRoleUnitDtoByControlId(controlId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addControlRole(Long userId, String controlId, List<Long> unitIds, String role) {
        log.info("新增控制单元角色。userId:{},controlId:{},role:{},unitIds:{}", userId, controlId, role, unitIds);
        List<ControlRoleEntity> entities = new ArrayList<>();
        List<Long> updateIds = new ArrayList<>();
        List<Long> insertUnitIds = new ArrayList<>(unitIds);
        // 修改之前的is_deleted状态
        List<ControlRoleEntity> deletedEntities = controlRoleMapper.selectDeletedRole(controlId, unitIds, role);
        deletedEntities.forEach(entity -> {
            updateIds.add(entity.getId());
            // 删除已经存在的
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
            boolean flag = SqlHelper.retBool(controlRoleMapper.updateIsDeletedByIds(userId, updateIds, false));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
    }

    @Override
    public void addControlRole(Long userId, String controlId, Map<Long, String> unitRoleMap) {
        log.info("「{}」新增控制单元「{}」的组织单元角色集", userId, controlId);
        List<Long> unitIds = ListUtil.toList(unitRoleMap.keySet());
        List<String> roleCodes = ListUtil.toList((unitRoleMap.values()));
        // 修改之前的is_deleted状态
        List<ControlRoleEntity> deletedEntities = controlRoleMapper.selectDeletedRoleByRoleCodes(controlId,
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
            boolean flag = SqlHelper.retBool(controlRoleMapper.updateIsDeletedByIds(userId, updateIds, false));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void editControlRole(Long userId, String controlId, List<Long> unitIds, String role) {
        if (CollUtil.isEmpty(unitIds)) {
            return;
        }
        log.info("「{}」修改控制单元「{}」组织单元「{}」的角色为「{}」", userId, controlId, unitIds, role);
        List<ControlRoleEntity> controlRoles = controlRoleMapper.selectByControlIdAndUnitIds(controlId, unitIds, true);
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
                // 没有这个权限
                if (!roleCodes.contains(role)) {
                    addControlRoleUnitIds.add(unitId);
                }
                else {
                    // 这个权限之前删除了
                    if (unitRoleMap.get(unitId).get(role).getIsDeleted()) {
                        recoverIds.add(unitRoleMap.get(unitId).get(role).getId());
                    }
                }
                // 之前有这个权限，删除除了这个权限的其他未删除的权限
                deleteIds.addAll(roleCodes.stream().filter(i -> !unitRoleMap.get(unitId).get(i).getRoleCode().equals(role) && !unitRoleMap.get(unitId).get(i).getIsDeleted())
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
    public void editControlRole(Long userId, List<Long> controlRoleIds, String role) {
        log.info("「{}」修改控制单元表ID「{}」的角色为「{}」", userId, controlRoleIds, role);
        boolean flag = SqlHelper.retBool(controlRoleMapper.updateRoleCodeByIds(userId, controlRoleIds, role));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    public void removeByControlIds(Long userId, List<String> controlIds) {
        log.info("删除指定控制单元的所有角色「{}」", controlIds);
        // 查询主键ID
        List<Long> controlRoleIds = controlRoleMapper.selectIdByControlIds(controlIds);
        // 逻辑删除
        removeByIds(controlRoleIds);
    }

    @Override
    public void removeByUnitIds(List<Long> unitIds) {
        log.info("删除指定组织单元的所有角色「{}」", unitIds);
        // 查询主键ID
        List<Long> controlRoleIds = controlRoleMapper.selectIdByUnitIds(unitIds);
        // 逻辑删除
        removeByIds(controlRoleIds);
    }

    @Override
    public void removeByControlIdAndUnitId(String controlId, Long unitId) {
        log.info("删除控制单元「{}」下组织单元「{}」的角色", controlId, unitId);
        List<Long> controlRoleIds = controlRoleMapper.selectIdByControlIdAndUnitId(controlId, unitId);
        boolean flag = removeByIds(controlRoleIds);
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }

    @Override
    public void removeByControlIdAndUnitIds(String controlId, List<Long> unitIds) {
        log.info("删除控制单元「{}」下组织单元「{}」的角色", controlId, unitIds);
        List<Long> controlRoleIds = controlRoleMapper.selectIdByControlIdAndUnitIds(controlId, unitIds);
        boolean flag = removeByIds(controlRoleIds);
        ExceptionUtil.isTrue(flag, DatabaseException.DELETE_ERROR);
    }

    @Override
    public ControlRoleEntity getByControlIdAndUnitIdAndRoleCode(String controlId, Long unitId, String roleCode,
            boolean ignoreDeleted) {
        return controlRoleMapper.selectByControlIdAndUnitIdAndRoleCode(controlId, unitId, roleCode, ignoreDeleted);
    }

    @Override
    public void editIsDeletedByIds(List<Long> ids, Long userId, boolean isDeleted) {
        if (CollUtil.isEmpty(ids)) {
            return;
        }
        controlRoleMapper.updateIsDeletedByIds(userId, ids, isDeleted);
    }

    @Override
    public Map<Long, String> getUnitIdToRoleCodeMapWithoutOwnerRole(String controlId, List<Long> unitIds) {
        log.info("获取控制单元「{}」组织单元「{}」的所有角色信息", controlId, unitIds);
        List<ControlRoleEntity> controlRoles = controlRoleMapper.selectByControlIdAndUnitIds(controlId, unitIds, false);
        Map<Long, String> unitIdToCodeRole = new HashMap<>(unitIds.size());
        controlRoles.stream()
                .filter(controlRole -> !controlRole.getRoleCode().equals(Node.OWNER))
                .forEach(controlRole -> unitIdToCodeRole.put(controlRole.getUnitId(), controlRole.getRoleCode()));
        return unitIdToCodeRole;
    }
}
