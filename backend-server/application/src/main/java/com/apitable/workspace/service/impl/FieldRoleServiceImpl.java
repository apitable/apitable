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

package com.apitable.workspace.service.impl;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toList;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.control.entity.ControlEntity;
import com.apitable.control.entity.ControlRoleEntity;
import com.apitable.control.entity.ControlSettingEntity;
import com.apitable.control.infrastructure.ControlIdBuilder;
import com.apitable.control.infrastructure.ControlIdBuilder.ControlId;
import com.apitable.control.infrastructure.ControlRoleDict;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.ControlType;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.RoleConstants.Field;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.control.service.IControlRoleService;
import com.apitable.control.service.IControlService;
import com.apitable.control.service.IControlSettingService;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.UnitMapper;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.IOrganizationService;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.vo.RoleInfoVo;
import com.apitable.organization.vo.UnitMemberVo;
import com.apitable.organization.vo.UnitTeamVo;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.workspace.dto.ControlRoleInfo;
import com.apitable.workspace.dto.ControlRoleUnitDTO;
import com.apitable.workspace.dto.DatasheetSnapshot;
import com.apitable.workspace.dto.DatasheetSnapshot.Column;
import com.apitable.workspace.dto.DatasheetSnapshot.View;
import com.apitable.workspace.enums.DataSheetException;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.ro.FieldControlProp;
import com.apitable.workspace.service.IControlMemberService;
import com.apitable.workspace.service.IDatasheetMetaService;
import com.apitable.workspace.service.IFieldRoleService;
import com.apitable.workspace.service.INodeRelService;
import com.apitable.workspace.service.INodeRoleService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.FieldCollaboratorVO;
import com.apitable.workspace.vo.FieldPermission;
import com.apitable.workspace.vo.FieldPermissionInfo;
import com.apitable.workspace.vo.FieldPermissionView;
import com.apitable.workspace.vo.FieldRole;
import com.apitable.workspace.vo.FieldRoleMemberVo;
import com.apitable.workspace.vo.FieldRoleSetting;
import com.apitable.workspace.vo.NodeRoleMemberVo;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Field role service implementation.
 */
@Service
@Slf4j
public class FieldRoleServiceImpl implements IFieldRoleService {

    @Resource
    private IControlService iControlService;

    @Resource
    private IControlSettingService iControlSettingService;

    @Resource
    private IControlRoleService iControlRoleService;

    @Resource
    private IControlMemberService iControlMemberService;

    @Resource
    private IDatasheetMetaService iDatasheetMetaService;

    @Resource
    private IOrganizationService iOrganizationService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private INodeRelService iNodeRelService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private INodeService iNodeService;

    @Resource
    private ObjectMapper objectMapper;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private INodeRoleService iNodeRoleService;

    @Resource
    private UnitMapper unitMapper;

    @Resource
    private IRoleService iRoleService;

    @Resource
    private IRoleMemberService iRoleMemberService;

    @Override
    public boolean getFieldRoleEnabledStatus(String dstId, String fieldId) {
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fieldId);
        AtomicReference<Boolean> assign = new AtomicReference<>(false);
        iControlService.checkControlStatus(controlId.toString(), assign::set);
        return assign.get();
    }

    @Override
    public void checkFieldPermissionBeforeEnable(String dstId, String fieldId) {
        log.info("check field availabilitydstId:{},fieldId:{}", dstId, fieldId);
        // get a snapshot of a datasheet
        DatasheetSnapshot snapshot = iDatasheetMetaService.getMetaByDstId(dstId);
        ExceptionUtil.isNotNull(snapshot, DataSheetException.DATASHEET_NOT_EXIST);
        ExceptionUtil.isNotNull(snapshot.getMeta(), DataSheetException.DATASHEET_NOT_EXIST);
        // check if the field exists
        ExceptionUtil.isNotEmpty(snapshot.getMeta().getFieldMap(),
            DataSheetException.FIELD_NOT_EXIST);
        ExceptionUtil.isTrue(snapshot.getMeta().getFieldMap().containsKey(fieldId),
            DataSheetException.FIELD_NOT_EXIST);
        // check whether the field is the first column
        List<View> views = snapshot.getMeta().getViews();
        ExceptionUtil.isNotEmpty(views, DataSheetException.VIEW_NOT_EXIST);
        // remove view
        Optional<View> indexView = views.stream().findFirst();
        ExceptionUtil.isTrue(indexView.isPresent(), DataSheetException.VIEW_NOT_EXIST);
        // remove the column properties of the view
        List<Column> columns = indexView.get().getColumns();
        ExceptionUtil.isNotEmpty(columns, DataSheetException.VIEW_NOT_EXIST);
        // take out the field id of the first column
        Optional<Column> column = columns.stream().findFirst();
        ExceptionUtil.isTrue(column.isPresent(), DataSheetException.VIEW_NOT_EXIST);
        String indexFieldId = column.get().getFieldId();
        ExceptionUtil.isFalse(indexFieldId.equals(fieldId),
            PermissionException.INDEX_FIELD_NOT_ALLOW_SET);
    }

    @Override
    public void checkFieldHasOperation(String controlId, Long memberId) {
        log.info("Check whether the field role change operation is allowed");
        ControlEntity controlEntity = iControlService.getByControlId(controlId);
        ExceptionUtil.isNotNull(controlEntity, PermissionException.FIELD_PERMISSION_NOT_OPEN);
        List<Long> admins =
            iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(controlEntity.getSpaceId());
        if (admins.contains(memberId)) {
            return;
        }
        if (controlEntity.getUpdatedBy() != null) {
            Long creator =
                iMemberService.getMemberIdByUserIdAndSpaceId(controlEntity.getUpdatedBy(),
                    controlEntity.getSpaceId());
            ExceptionUtil.isNotNull(creator, PermissionException.ILLEGAL_CHANGE_FIELD_ROLE);
            ExceptionUtil.isTrue(creator.equals(memberId),
                PermissionException.ILLEGAL_CHANGE_FIELD_ROLE);
        }
    }

    @Override
    @SuppressWarnings({"rawtypes", "unchecked"})
    public PageInfo<FieldRoleMemberVo> getFieldRoleMembersPageInfo(
        Page<FieldRoleMemberVo> page, String datasheetId, String fieldId) {
        boolean assignMode = this.getFieldRoleEnabledStatus(datasheetId, fieldId);
        if (!assignMode) {
            Page nodeRolePage = BeanUtil.copyProperties(page, Page.class);
            PageInfo<NodeRoleMemberVo> nodeRolePageInfo =
                iNodeRoleService.getNodeRoleMembersPageInfo(nodeRolePage, datasheetId);
            List<FieldRoleMemberVo> records = new ArrayList<>();
            for (NodeRoleMemberVo record : nodeRolePageInfo.getRecords()) {
                FieldRoleMemberVo vo =
                    BeanUtil.copyProperties(record, FieldRoleMemberVo.class);
                String role = record.getRole().equals(Node.READER)
                    ? Field.READER : Field.EDITOR;
                vo.setRole(role);
                records.add(vo);
            }
            PageInfo pageInfo = BeanUtil.copyProperties(nodeRolePageInfo, PageInfo.class);
            pageInfo.setRecords(records);
            return pageInfo;
        }
        String spaceId = iNodeService.getSpaceIdByNodeId(datasheetId);
        ControlId controlId = ControlIdBuilder.fieldId(datasheetId, fieldId);
        return iControlMemberService.getControlRoleMemberPageInfo(page, spaceId, controlId,
            FieldRoleMemberVo.class);
    }

    @Override
    public FieldCollaboratorVO getFieldRoles(String datasheetId, String fieldId) {
        log.info("load field role information: {} {}", datasheetId, fieldId);
        ControlId controlId = ControlIdBuilder.fieldId(datasheetId, fieldId);
        FieldCollaboratorVO fieldCollaboratorVO = new FieldCollaboratorVO();
        String spaceId = iNodeService.getSpaceIdByNodeId(datasheetId);
        // is field permission open
        iControlService.checkControlStatus(controlId.toString(), fieldCollaboratorVO::setEnabled);
        if (BooleanUtil.isFalse(fieldCollaboratorVO.getEnabled())) {
            Map<Long, String> memberRoleMap = new LinkedHashMap<>(16);
            List<FieldRole> roles = getDefaultFieldRoles(spaceId, datasheetId, memberRoleMap);
            fieldCollaboratorVO.setRoles(roles);
            return fieldCollaboratorVO;
        }
        // load permission attribute configuration
        ControlSettingEntity controlSetting =
            iControlSettingService.getByControlId(controlId.toString());
        fieldCollaboratorVO.setSetting(
            JSONUtil.toBean(controlSetting.getProps(), FieldRoleSetting.class));
        // 1、space workbench administrator + Owner
        List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId);
        List<Long> managerMemberIds = new ArrayList<>(admins);
        // owner
        Long owner =
            memberMapper.selectIdByUserIdAndSpaceId(controlSetting.getUpdatedBy(), spaceId);
        if (owner != null) {
            managerMemberIds.add(owner);
        }
        Map<Long, FieldRole> unitIdToFieldRoleMap = new LinkedHashMap<>(16);
        List<UnitMemberVo> unitMemberVos = iOrganizationService.findUnitMemberVo(managerMemberIds);
        // handle member's team name, get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamNameMap =
            iTeamService.batchGetFullHierarchyTeamNames(managerMemberIds, spaceId);
        for (UnitMemberVo member : unitMemberVos) {
            // prevent owner from belonging to workbench administrator and repeatedly build fieldrole
            if (unitIdToFieldRoleMap.containsKey(member.getUnitId())) {
                continue;
            }
            boolean isAdmin = admins.contains(member.getMemberId());
            boolean isOwner = member.getMemberId().equals(owner);
            FieldRole role = buildFieldRole(isAdmin, member, isOwner);
            role.setUnitRefId(member.getMemberId());
            if (memberToTeamNameMap.containsKey(member.getMemberId())) {
                role.setTeamData(memberToTeamNameMap.get(member.getMemberId()));
            }
            unitIdToFieldRoleMap.put(role.getUnitId(), role);
        }
        // 2、The datasheet field specifies the organizational unit of the role.
        List<ControlRoleUnitDTO> controlRoles =
            iControlRoleService.getControlRolesUnitDtoByControlId(controlId.toString());
        Map<String, List<ControlRoleUnitDTO>> fieldRoleControlMap = controlRoles.stream()
            .sorted(Comparator.comparing(
                (Function<ControlRoleUnitDTO, Long>) t -> ControlRoleManager.parseFieldRole(
                    t.getRole()).getBits()).reversed())
            .collect(groupingBy(ControlRoleUnitDTO::getRole, LinkedHashMap::new, toList()));
        for (Entry<String, List<ControlRoleUnitDTO>> entry : fieldRoleControlMap.entrySet()) {
            List<Long> teamIds = new ArrayList<>();
            List<Long> memberIds = new ArrayList<>();
            List<Long> roleIds = new ArrayList<>();
            for (ControlRoleUnitDTO control : entry.getValue()) {
                if (unitIdToFieldRoleMap.containsKey(control.getUnitId())) {
                    unitIdToFieldRoleMap.get(control.getUnitId()).setPermissionExtend(false);
                    continue;
                }
                FieldRole role = new FieldRole();
                role.setRole(control.getRole());
                role.setUnitId(control.getUnitId());
                role.setUnitType(control.getUnitType());
                UnitType unitType = UnitType.toEnum(control.getUnitType());
                if (unitType == UnitType.TEAM) {
                    teamIds.add(control.getUnitRefId());
                } else if (unitType == UnitType.MEMBER) {
                    memberIds.add(control.getUnitRefId());
                } else if (unitType == UnitType.ROLE) {
                    roleIds.add(control.getUnitRefId());
                }
                role.setCanRead(true);
                role.setCanEdit(true);
                role.setCanRemove(true);
                unitIdToFieldRoleMap.putIfAbsent(control.getUnitId(), role);
            }
            // Batch query supplementary organizational unit information
            if (!memberIds.isEmpty()) {
                List<UnitMemberVo> memberVos = iOrganizationService.findUnitMemberVo(memberIds);
                // handle member's team name, get full hierarchy team name
                Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap =
                    iTeamService.batchGetFullHierarchyTeamNames(memberIds, spaceId);
                for (UnitMemberVo member : memberVos) {
                    appendMemberFieldRole(unitIdToFieldRoleMap, memberToTeamPathInfoMap, member);
                }
            }
            if (!teamIds.isEmpty()) {
                List<UnitTeamVo> teamVos = iOrganizationService.findUnitTeamVo(spaceId, teamIds);
                for (UnitTeamVo team : teamVos) {
                    FieldRole role = unitIdToFieldRoleMap.get(team.getUnitId());
                    role.setUnitName(team.getTeamName());
                    role.setMemberCount(team.getMemberCount());
                    role.setUnitRefId(team.getTeamId());
                }
            }
            if (!roleIds.isEmpty()) {
                List<RoleInfoVo> roleVos = iRoleService.getRoleVos(spaceId, roleIds);
                for (RoleInfoVo roleVo : roleVos) {
                    FieldRole role = unitIdToFieldRoleMap.get(roleVo.getUnitId());
                    role.setUnitName(roleVo.getRoleName());
                    role.setMemberCount(roleVo.getMemberCount());
                    role.setUnitRefId(roleVo.getRoleId());
                }
            }
        }
        fieldCollaboratorVO.setRoles(ListUtil.toList(unitIdToFieldRoleMap.values()));
        return fieldCollaboratorVO;
    }

    private void appendMemberFieldRole(Map<Long, FieldRole> unitIdToFieldRoleMap,
                                       Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap,
                                       UnitMemberVo member) {
        FieldRole role = unitIdToFieldRoleMap.get(member.getUnitId());
        role.setUnitName(member.getMemberName());
        role.setAvatar(member.getAvatar());
        role.setTeams(member.getTeams());
        role.setUnitRefId(member.getMemberId());
        if (memberToTeamPathInfoMap.containsKey(member.getMemberId())) {
            role.setTeamData(memberToTeamPathInfoMap.get(member.getMemberId()));
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enableFieldRole(Long userId, String dstId, String fldId, boolean includeExtend) {
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fldId);
        String spaceId = iNodeService.getSpaceIdByNodeId(dstId);
        iControlService.create(userId, spaceId, controlId.toString(), controlId.getControlType());
        // initialize field permission settings
        iControlSettingService.create(userId, controlId.toString());
        if (includeExtend) {
            addExtendFieldRole(userId, dstId, fldId);
        }
    }

    @Override
    public void addFieldRole(Long userId, String controlId, List<Long> unitIds, String role) {
        log.info("Add field role. userId:{},controlId:{},role:{},unitIds:{}", userId, controlId,
            role, unitIds);
        // Filter organizational units, modify those that already exist, and add those that do not exist.
        List<ControlRoleEntity> controlRoles = iControlRoleService.getByControlId(controlId);
        // no existing organizational units all new
        if (CollUtil.isEmpty(controlRoles)) {
            iControlRoleService.addControlRole(userId, controlId, unitIds, role);
            return;
        }
        Map<Long, String> unitRoleMap = controlRoles.stream()
            .collect(
                Collectors.toMap(ControlRoleEntity::getUnitId, ControlRoleEntity::getRoleCode));
        List<Long> addUnitIds = new ArrayList<>();
        List<Long> updateUnitIds = new ArrayList<>();
        for (Long unitId : unitIds) {
            if (!unitRoleMap.containsKey(unitId)) {
                // Does not exist, add the role of this organizational unit
                addUnitIds.add(unitId);
            } else if (!unitRoleMap.get(unitId).equals(role)) {
                // exists and the roles are different, modify the roles of this organizational unit
                updateUnitIds.add(unitId);
            }
        }
        if (CollUtil.isNotEmpty(addUnitIds)) {
            iControlRoleService.addControlRole(userId, controlId, addUnitIds, role);
        }
        if (CollUtil.isNotEmpty(updateUnitIds)) {
            iControlRoleService.editControlRole(userId, controlId, updateUnitIds, role);
        }
    }

    @Override
    public void editFieldRole(Long userId, String controlId, List<Long> unitIds, String role) {
        log.info("Update the role permission [{}] of the unit [{}] under the field [{}]", controlId,
            unitIds, role);
        // The role of the original organizational unit in the column
        Map<Long, String> unitIdToRoleCode =
            iControlRoleService.getUnitIdToRoleCodeMapWithoutOwnerRole(controlId, unitIds);
        if (unitIdToRoleCode.keySet().size() != unitIds.size()) {
            throw new BusinessException(PermissionException.FIELD_ROLE_NOT_EXIST);
        }
        List<Long> subUnitIds = unitIds.stream()
            .filter(unitId -> !role.equals(unitIdToRoleCode.get(unitId)))
            .collect(toList());
        // revised
        iControlRoleService.editControlRole(userId, controlId, subUnitIds, role);
    }

    @Override
    public String deleteFieldRole(String controlId, String datasheetId, Long unitId) {
        log.info("Delete field [{}] permission role [{}]", controlId, unitId);
        String roleCode = iControlRoleService.getRoleCodeByControlIdAndUnitId(controlId, unitId);
        if (roleCode == null) {
            throw new BusinessException(PermissionException.FIELD_ROLE_NOT_EXIST);
        }
        iControlRoleService.removeByControlIdAndUnitId(controlId, unitId);
        return roleCode;
    }

    @Override
    public void updateFieldRoleProp(Long userId, String controlId, FieldControlProp prop) {
        log.info("change the settings for control permissions");
        ControlSettingEntity controlSetting = iControlSettingService.getByControlId(controlId);
        String propJson = controlSetting.getProps();
        try {
            JsonNode oldProps = objectMapper.readTree(propJson);
            JsonNode newProps = objectMapper.readTree(JSONUtil.toJsonStr(prop));
            if (!oldProps.equals(newProps)) {
                ControlSettingEntity updater = new ControlSettingEntity();
                updater.setId(controlSetting.getId());
                updater.setProps(objectMapper.writeValueAsString(newProps));
                updater.setUpdatedBy(userId);
                iControlSettingService.updateById(updater);
                log.info("configuration update successful");
            }
        } catch (JsonProcessingException e) {
            log.error("update field role prop error", e);
            throw new BusinessException(PermissionException.UPDATE_FIELD_ROLE_SETTING);
        }
    }

    @Override
    public FieldPermissionView getFieldPermissionView(Long memberId, String nodeId,
                                                      String shareId) {
        log.info(
            "The member [{}] obtains the field permission of the node [{}] and shares the ID: [{}]",
            memberId, nodeId, shareId);
        NodeType type = iNodeService.getTypeByNodeId(nodeId);
        String datasheetId;
        switch (type) {
            case DATASHEET:
                datasheetId = nodeId;
                break;
            case FORM:
            case MIRROR:
                Map<String, String> formToDatasheetMap =
                    iNodeRelService.getRelNodeToMainNodeMap(Collections.singletonList(nodeId));
                if (MapUtil.isEmpty(formToDatasheetMap)
                    || !formToDatasheetMap.containsKey(nodeId)) {
                    return null;
                }
                datasheetId = formToDatasheetMap.get(nodeId);
                break;
            default:
                return null;
        }
        List<String> controlIds = iControlService.getControlIdByControlIdPrefixAndType(datasheetId,
            ControlType.DATASHEET_FIELD.getVal());
        if (controlIds == null || controlIds.isEmpty()) {
            return new FieldPermissionView(nodeId, datasheetId, null);
        }
        Map<String, String> controlIdToFieldIdMap = controlIds.stream()
            .collect(Collectors.toMap(String::toString,
                controlId -> controlId.substring(controlId.indexOf(ControlIdBuilder.SYMBOL) + 1)));
        // load field permissions in sharing
        if (StrUtil.isNotBlank(shareId)) {
            // If the datasheet is not collected, directly return the field with the permission set.
            if (type != NodeType.FORM) {
                Map<String, FieldPermissionInfo> permissionInfoMap =
                    controlIdToFieldIdMap.values().stream()
                        .collect(Collectors.toMap(String::toString,
                            fieldId -> FieldPermissionInfo.builder()
                                .fieldId(fieldId)
                                .permission(new FieldPermission())
                                .build()));
                return new FieldPermissionView(nodeId, datasheetId, permissionInfoMap);
            }
            // collect the datasheet and add the permission configuration attribute of the returned field.
            List<ControlSettingEntity> controlSettingEntities =
                iControlSettingService.getBatchByControlIds(controlIds);
            Map<String, ControlSettingEntity> controlSettingEntityMap =
                controlSettingEntities.stream()
                    .collect(
                        Collectors.toMap(ControlSettingEntity::getControlId, Function.identity()));
            Map<String, FieldPermissionInfo> permissionInfoMap =
                controlIdToFieldIdMap.entrySet().stream()
                    .collect(
                        Collectors.toMap(Map.Entry::getValue, entry -> FieldPermissionInfo.builder()
                            .fieldId(entry.getValue())
                            .setting(JSONUtil.toBean(
                                controlSettingEntityMap.get(entry.getKey()).getProps(),
                                FieldRoleSetting.class))
                            .permission(new FieldPermission())
                            .build()));
            return new FieldPermissionView(nodeId, datasheetId, permissionInfoMap);
        }
        // in station loading
        // get the permission role set
        ControlRoleDict roleDict = controlTemplate.fetchFieldRole(memberId, datasheetId,
            ListUtil.list(true, controlIdToFieldIdMap.values()));
        // get permission configuration properties
        List<ControlSettingEntity> controlSettingEntities =
            iControlSettingService.getBatchByControlIds(controlIds);
        Map<String, String> controlIdToPropsMap = controlSettingEntities.stream()
            .collect(Collectors.toMap(ControlSettingEntity::getControlId,
                ControlSettingEntity::getProps));
        Map<String, Long> controlId2Creator = controlSettingEntities.stream()
            .collect(Collectors.toMap(ControlSettingEntity::getControlId,
                ControlSettingEntity::getUpdatedBy));
        Long userId = memberMapper.selectUserIdByMemberId(memberId);
        Map<String, FieldPermissionInfo> permissionInfoMap =
            controlIdToFieldIdMap.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getValue, entry -> {
                    FieldPermissionInfo fieldPermissionInfo = new FieldPermissionInfo();
                    fieldPermissionInfo.setFieldId(entry.getValue());
                    fieldPermissionInfo.setSetting(
                        JSONUtil.toBean(controlIdToPropsMap.get(entry.getKey()),
                            FieldRoleSetting.class));
                    if (roleDict.containsKey(entry.getValue())) {
                        ControlRole role = roleDict.get(entry.getValue());
                        fieldPermissionInfo.setHasRole(true);
                        fieldPermissionInfo.setRole(role.getRoleTag());
                        // Add whether the current user can manage this permission
                        fieldPermissionInfo.setManageable(
                            role.isAdmin() || controlId2Creator.get(entry.getKey()).equals(userId));
                        fieldPermissionInfo.setPermission(
                            role.permissionToBean(FieldPermission.class));
                    } else {
                        fieldPermissionInfo.setPermission(new FieldPermission());
                    }
                    return fieldPermissionInfo;
                }));

        return new FieldPermissionView(nodeId, datasheetId, permissionInfoMap);
    }

    @Override
    public Map<String, FieldPermissionInfo> getFieldPermissionMap(Long memberId, String nodeId,
                                                                  String shareId) {
        FieldPermissionView view = this.getFieldPermissionView(memberId, nodeId, shareId);
        if (view != null) {
            return view.getFieldPermissionMap();
        }
        return null;
    }

    @Override
    public List<String> getPermissionFieldIds(String datasheetId) {
        List<String> controlIds = iControlService.getControlIdByControlIdPrefixAndType(datasheetId,
            ControlType.DATASHEET_FIELD.getVal());
        if (controlIds == null || controlIds.isEmpty()) {
            return new ArrayList<>();
        }
        return controlIds.stream()
            .map(controlId -> controlId.substring(controlId.indexOf(ControlIdBuilder.SYMBOL) + 1))
            .collect(Collectors.toList());
    }

    @Override
    public Map<String, List<Long>> deleteFieldRoles(String controlId, List<Long> unitIds) {
        if (CollUtil.isEmpty(unitIds)) {
            return new HashMap<>();
        }
        log.info("delete field [{}] permission role [{}]", controlId, unitIds);
        List<ControlRoleInfo> controlRole =
            iControlRoleService.getUnitRoleByControlIdAndUnitIds(controlId, unitIds);
        Map<String, List<Long>> roleToUnitIds = controlRole.stream()
            .collect(groupingBy(ControlRoleInfo::getRole,
                mapping(ControlRoleInfo::getUnitId, toList())));
        List<Long> existUnitIds =
            roleToUnitIds.values().stream().flatMap(Collection::stream).collect(toList());
        if (CollUtil.isEmpty(existUnitIds)) {
            return roleToUnitIds;
        }
        iControlRoleService.removeByControlIdAndUnitIds(controlId, existUnitIds);
        return roleToUnitIds;
    }

    private void addExtendFieldRole(Long userId, String dstId, String fldId) {
        String spaceId = iNodeService.getSpaceIdByNodeId(dstId);
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fldId);
        Map<String, List<Long>> fieldRoleToUnitIdsMap =
            getDefaultFiledRoleToUnitIdsMap(spaceId, dstId);
        fieldRoleToUnitIdsMap.forEach((role, unitIds) -> {
            // add role
            addFieldRole(userId, controlId.toString(), unitIds, role);
        });
    }

    private Map<String, List<Long>> getDefaultFiledRoleToUnitIdsMap(String spaceId, String dstId) {
        Map<String, Set<Long>> nodeRoleToUnitIds =
            iNodeRoleService.getRoleToUnitIds(false, spaceId, dstId);
        Map<String, List<Long>> fieldRoleToUnitIds = new HashMap<>(2);
        if (nodeRoleToUnitIds.containsKey(Node.READER)) {
            Set<Long> readUnitIds = nodeRoleToUnitIds.get(Node.READER);
            boolean haveOwner = nodeRoleToUnitIds.containsKey(Node.OWNER)
                && nodeRoleToUnitIds.get(Node.OWNER).stream().findFirst().isPresent();
            if (haveOwner) {
                Long ownerUnitId = nodeRoleToUnitIds.get(Node.OWNER).stream().findFirst().get();
                readUnitIds.remove(ownerUnitId);
            }
            fieldRoleToUnitIds.put(Field.READER, CollUtil.newArrayList(readUnitIds));
            nodeRoleToUnitIds.remove(Node.READER);
        }
        if (!nodeRoleToUnitIds.isEmpty()) {
            Set<Long> editUnitIds = nodeRoleToUnitIds.values().stream()
                .reduce(new HashSet<>(), (result, unitIds) -> {
                    result.addAll(unitIds);
                    return result;
                });
            fieldRoleToUnitIds.put(Field.EDITOR, CollUtil.newArrayList(editUnitIds));
        }
        return fieldRoleToUnitIds;
    }

    private List<FieldRole> getDefaultFieldRoles(String spcId, String dstId,
                                                 Map<Long, String> memberRoleMap) {
        List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spcId);
        // record the corresponding roles of all members
        List<FieldRole> fieldRoles = new ArrayList<>(16);
        List<UnitMemberVo> unitMemberVos = iOrganizationService.findUnitMemberVo(admins);
        // handle member's team name, get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap =
            iTeamService.batchGetFullHierarchyTeamNames(admins, spcId);
        Set<Long> adminIds = new HashSet<>();
        for (UnitMemberVo member : unitMemberVos) {
            boolean isAdmin = admins.contains(member.getMemberId());
            FieldRole role = buildFieldRole(isAdmin, member, false);
            role.setUnitRefId(member.getMemberId());
            if (memberToTeamPathInfoMap.containsKey(member.getMemberId())) {
                role.setTeamData(memberToTeamPathInfoMap.get(member.getMemberId()));
            }
            adminIds.add(member.getUnitId());
            fieldRoles.add(role);
            memberRoleMap.put(member.getMemberId(), Field.EDITOR);
        }
        // Gets the inherited role from the datasheet where the field is located.
        fieldRoles.addAll(getDefaultExtendRole(spcId, dstId, adminIds, memberRoleMap));
        return fieldRoles;
    }

    private List<FieldRole> getDefaultExtendRole(String spcId, String dstId, Set<Long> adminIds,
                                                 Map<Long, String> memberRoleMap) {
        Map<String, List<Long>> filedRoleToUnitIds = getDefaultFiledRoleToUnitIdsMap(spcId, dstId);
        // editor from node's owner. the member may be admin.
        filedRoleToUnitIds.values().forEach(unitIds -> unitIds.removeAll(adminIds));
        List<FieldRole> fieldRoles = new ArrayList<>(16);
        Map<Long, FieldRole> unitIdToFieldRoleMap = new HashMap<>(16);
        Map<UnitType, List<Long>> unitTypeToUnitRefIds = new HashMap<>(16);
        // gets field control permissions
        filedRoleToUnitIds.forEach((role, unitIds) -> {
            if (unitIds.isEmpty()) {
                return;
            }
            List<UnitEntity> units = unitMapper.selectByUnitIds(unitIds);
            List<FieldRole> fieldRoleList = buildFieldRoles(units, role, unitTypeToUnitRefIds);
            fieldRoleList.forEach(fieldRole -> {
                Long unitId = fieldRole.getUnitId();
                if (!unitIdToFieldRoleMap.containsKey(unitId)) {
                    unitIdToFieldRoleMap.put(unitId, fieldRole);
                    fieldRoles.add(fieldRole);
                }
            });
            countMemberRole(memberRoleMap, units, role);
        });
        // batch populate field roles' other info
        populateFieldRoles(unitIdToFieldRoleMap, unitTypeToUnitRefIds, spcId);
        return fieldRoles;
    }

    private void populateFieldRoles(Map<Long, FieldRole> unitIdToFieldRoleMap,
                                    Map<UnitType, List<Long>> unitTypeToUnitRefIds, String spcId) {
        unitTypeToUnitRefIds.forEach((key, unitRefIds) -> {
            if (key == UnitType.MEMBER) {
                List<UnitMemberVo> memberVos = iOrganizationService.findUnitMemberVo(unitRefIds);
                // handle member's team name, get full hierarchy team name
                Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap =
                    iTeamService.batchGetFullHierarchyTeamNames(unitRefIds, spcId);
                memberVos.forEach(member -> {
                    appendMemberFieldRole(unitIdToFieldRoleMap, memberToTeamPathInfoMap, member);
                });
            } else if (key == UnitType.TEAM) {
                List<UnitTeamVo> teamVos = iOrganizationService.findUnitTeamVo(spcId, unitRefIds);
                teamVos.forEach(team -> {
                    FieldRole fieldRole = unitIdToFieldRoleMap.get(team.getUnitId());
                    fieldRole.setUnitName(team.getTeamName());
                    fieldRole.setMemberCount(team.getMemberCount());
                    fieldRole.setUnitRefId(team.getTeamId());
                });
            } else if (key == UnitType.ROLE) {
                List<RoleInfoVo> roleVos = iRoleService.getRoleVos(spcId, unitRefIds);
                roleVos.forEach(role -> {
                    FieldRole fieldRole = unitIdToFieldRoleMap.get(role.getUnitId());
                    fieldRole.setUnitName(role.getRoleName());
                    fieldRole.setMemberCount(role.getMemberCount());
                    fieldRole.setUnitRefId(role.getRoleId());
                });
            }
        });
    }

    private List<FieldRole> buildFieldRoles(List<UnitEntity> units, String role,
                                            Map<UnitType, List<Long>> unitTypeToUnitRefIds) {
        List<FieldRole> fieldRoles = new ArrayList<>();
        units.forEach(unit -> {
            FieldRole fieldRole = new FieldRole();
            fieldRole.setRole(role);
            fieldRole.setUnitId(unit.getId());
            fieldRole.setUnitType(unit.getUnitType());
            UnitType unitType = UnitType.toEnum(unit.getUnitType());
            fieldRoles.add(fieldRole);
            List<Long> unitRefIds =
                unitTypeToUnitRefIds.computeIfAbsent(unitType, key -> new ArrayList<>());
            unitRefIds.add(unit.getUnitRefId());
        });
        return fieldRoles;
    }

    private FieldRole buildFieldRole(boolean isAdmin, UnitMemberVo member, boolean isOwner) {
        FieldRole role = new FieldRole();
        role.setRole(Field.EDITOR);
        role.setUnitId(member.getUnitId());
        role.setUnitType(UnitType.MEMBER.getType());
        role.setUnitName(member.getMemberName());
        role.setAvatar(member.getAvatar());
        role.setTeams(member.getTeams());
        role.setIsAdmin(isAdmin);
        role.setIsOwner(isOwner);
        role.setCanRead(true);
        role.setCanEdit(true);
        role.setNodeManageable(true);
        role.setPermissionExtend(true);
        return role;
    }

    private void countMemberRole(Map<Long, String> memberRoleMap, List<UnitEntity> units,
                                 String role) {
        Map<Integer, List<Long>> unitTypeToUnitRefIds = units.stream()
            .collect(
                groupingBy(UnitEntity::getUnitType, mapping(UnitEntity::getUnitRefId, toList())));
        unitTypeToUnitRefIds.forEach((unitType, unitRefIds) -> {
            if (UnitType.MEMBER.getType().equals(unitType)) {
                for (Long memberId : unitRefIds) {
                    memberRoleMap.putIfAbsent(memberId, role);
                }
            } else if (UnitType.TEAM.getType().equals(unitType)) {
                List<Long> teamMemberIds = iTeamService.getMemberIdsByTeamIds(unitRefIds);
                for (Long teamMemberId : teamMemberIds) {
                    memberRoleMap.putIfAbsent(teamMemberId, role);
                }
            } else if (UnitType.ROLE.getType().equals(unitType)) {
                List<Long> roleMemberIds = iRoleMemberService.getMemberIdsByRoleIds(unitRefIds);
                for (Long roleMemberId : roleMemberIds) {
                    memberRoleMap.putIfAbsent(roleMemberId, role);
                }
            }
        });
    }

}
