package com.vikadata.api.modular.workspace.service.impl;

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
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.control.ControlIdBuilder;
import com.vikadata.api.control.ControlIdBuilder.ControlId;
import com.vikadata.api.control.ControlRoleDict;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.ControlType;
import com.vikadata.api.control.role.ControlRole;
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.RoleConstants.Field;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.enums.exception.DataSheetException;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.model.vo.datasheet.FieldCollaboratorVO;
import com.vikadata.api.model.vo.datasheet.FieldRole;
import com.vikadata.api.model.vo.datasheet.FieldRoleMemberVo;
import com.vikadata.api.model.vo.datasheet.FieldRoleSetting;
import com.vikadata.api.model.vo.node.FieldPermission;
import com.vikadata.api.model.vo.node.FieldPermissionInfo;
import com.vikadata.api.model.vo.node.FieldPermissionView;
import com.vikadata.api.model.vo.organization.UnitMemberVo;
import com.vikadata.api.model.vo.organization.UnitTeamVo;
import com.vikadata.api.modular.control.model.FieldControlProp;
import com.vikadata.api.modular.control.service.IControlRoleService;
import com.vikadata.api.modular.control.service.IControlService;
import com.vikadata.api.modular.control.service.IControlSettingService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.UnitMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IOrganizationService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.workspace.model.ControlRoleInfo;
import com.vikadata.api.modular.workspace.model.ControlRoleUnitDTO;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot.Column;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot.View;
import com.vikadata.api.modular.workspace.service.IDatasheetMetaService;
import com.vikadata.api.modular.workspace.service.IFieldRoleService;
import com.vikadata.api.modular.workspace.service.INodeRelService;
import com.vikadata.api.modular.workspace.service.INodeRoleService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.define.enums.NodeType;
import com.vikadata.entity.ControlEntity;
import com.vikadata.entity.ControlRoleEntity;
import com.vikadata.entity.ControlSettingEntity;
import com.vikadata.entity.UnitEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.DataSheetException.FIELD_NOT_EXIST;
import static com.vikadata.api.enums.exception.DataSheetException.VIEW_NOT_EXIST;
import static com.vikadata.api.enums.exception.PermissionException.FIELD_PERMISSION_NOT_OPEN;
import static com.vikadata.api.enums.exception.PermissionException.ILLEGAL_CHANGE_FIELD_ROLE;
import static com.vikadata.api.enums.exception.PermissionException.INDEX_FIELD_NOT_ALLOW_SET;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toList;

/**
 * 字段角色服务接口 实现
 * @author Shawn Deng
 * @date 2021-04-01 19:28:00
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

    @Override
    public void checkFieldPermissionBeforeEnable(String dstId, String fieldId) {
        log.info("检查字段可用性。dstId:{},fieldId:{}", dstId, fieldId);
        // 获取数表快照
        DatasheetSnapshot snapshot = iDatasheetMetaService.getMetaByDstId(dstId);
        ExceptionUtil.isNotNull(snapshot, DataSheetException.DATASHEET_NOT_EXIST);
        ExceptionUtil.isNotNull(snapshot.getMeta(), DataSheetException.DATASHEET_NOT_EXIST);
        // 检查字段是否存在
        ExceptionUtil.isNotEmpty(snapshot.getMeta().getFieldMap(), DataSheetException.FIELD_NOT_EXIST);
        ExceptionUtil.isTrue(snapshot.getMeta().getFieldMap().containsKey(fieldId), FIELD_NOT_EXIST);
        // 检查字段是否是首列
        List<View> views = snapshot.getMeta().getViews();
        ExceptionUtil.isNotEmpty(views, VIEW_NOT_EXIST);
        // 取出视图
        Optional<View> indexView = views.stream().findFirst();
        ExceptionUtil.isTrue(indexView.isPresent(), VIEW_NOT_EXIST);
        // 取出视图的列属性
        List<Column> columns = indexView.get().getColumns();
        ExceptionUtil.isNotEmpty(columns, VIEW_NOT_EXIST);
        // 取出首列字段ID
        Optional<Column> column = columns.stream().findFirst();
        ExceptionUtil.isTrue(column.isPresent(), VIEW_NOT_EXIST);
        String indexFieldId = column.get().getFieldId();
        ExceptionUtil.isFalse(indexFieldId.equals(fieldId), INDEX_FIELD_NOT_ALLOW_SET);
    }

    @Override
    public void checkFieldHasOperation(String controlId, Long memberId) {
        log.info("检查字段角色变更操作是否允许");
        ControlEntity controlEntity = iControlService.getByControlId(controlId);
        ExceptionUtil.isNotNull(controlEntity, FIELD_PERMISSION_NOT_OPEN);
        List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(controlEntity.getSpaceId());
        if (admins.contains(memberId)) {
            return;
        }
        if (controlEntity.getUpdatedBy() != null) {
            Long creator = iMemberService.getMemberIdByUserIdAndSpaceId(controlEntity.getUpdatedBy(),
                    controlEntity.getSpaceId());
            ExceptionUtil.isNotNull(creator, ILLEGAL_CHANGE_FIELD_ROLE);
            ExceptionUtil.isTrue(creator.equals(memberId), ILLEGAL_CHANGE_FIELD_ROLE);
        }
    }

    @Override
    public FieldCollaboratorVO getFieldRoles(String datasheetId, String fieldId) {
        log.info("加载字段角色信息: {} {}", datasheetId, fieldId);
        ControlId controlId = ControlIdBuilder.fieldId(datasheetId, fieldId);
        FieldCollaboratorVO fieldCollaboratorVO = new FieldCollaboratorVO();
        String spaceId = iNodeService.getSpaceIdByNodeId(datasheetId);
        // 字段权限是否打开
        iControlService.checkControlStatus(controlId.toString(), fieldCollaboratorVO::setEnabled);
        if (BooleanUtil.isFalse(fieldCollaboratorVO.getEnabled())) {
            List<FieldRole> roles = getDefaultFieldRoles(spaceId, datasheetId);
            fieldCollaboratorVO.setRoles(roles);
            return fieldCollaboratorVO;
        }
        // 加载权限属性配置
        ControlSettingEntity controlSetting = iControlSettingService.getByControlId(controlId.toString());
        fieldCollaboratorVO.setSetting(JSONUtil.toBean(controlSetting.getProps(), FieldRoleSetting.class));
        // 1、空间工作台管理员 + Owner
        List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId);
        List<Long> managerMemberIds = new ArrayList<>(admins);
        // owner
        Long owner = memberMapper.selectIdByUserIdAndSpaceId(controlSetting.getUpdatedBy(), spaceId);
        if (owner != null) {
            managerMemberIds.add(owner);
        }
        // 记载所有成员对应角色
        Map<Long, String> memberRoleMap = new LinkedHashMap<>(16);
        Map<Long, FieldRole> unitIdToFieldRoleMap = new LinkedHashMap<>(16);
        List<UnitMemberVo> unitMemberVos = iOrganizationService.findUnitMemberVo(managerMemberIds);
        for (UnitMemberVo member : unitMemberVos) {
            boolean isOwner = member.getMemberId().equals(owner);
            // 防止 Owner 属于工作台管理员，重复构建 FieldRole
            if (isOwner && memberRoleMap.containsKey(owner)) {
                continue;
            }
            boolean isAdmin = admins.contains(member.getMemberId());
            FieldRole role = getFieldRole(isAdmin, member, isOwner);
            unitIdToFieldRoleMap.put(role.getUnitId(), role);
            memberRoleMap.put(member.getMemberId(), Field.EDITOR);
        }
        // 2、数表字段指定角色的组织单元
        List<ControlRoleUnitDTO> controlRoles = iControlRoleService.getControlRolesUnitDtoByControlId(controlId.toString());
        Map<String, List<ControlRoleUnitDTO>> fieldRoleControlMap = controlRoles.stream()
                .sorted(Comparator.comparing((Function<ControlRoleUnitDTO, Long>) t -> ControlRoleManager.parseFieldRole(t.getRole()).getBits()).reversed())
                .collect(groupingBy(ControlRoleUnitDTO::getRole, LinkedHashMap::new, toList()));
        for (Entry<String, List<ControlRoleUnitDTO>> entry : fieldRoleControlMap.entrySet()) {
            List<Long> teamIds = new ArrayList<>();
            List<Long> memberIds = new ArrayList<>();
            String roleCode = entry.getKey();
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
                }
                else if (unitType == UnitType.MEMBER) {
                    memberIds.add(control.getUnitRefId());
                }
                role.setCanRead(true);
                role.setCanEdit(true);
                role.setCanRemove(true);
                unitIdToFieldRoleMap.putIfAbsent(control.getUnitId(), role);
            }
            // 批量查询补充组织单元信息
            if (!memberIds.isEmpty()) {
                List<UnitMemberVo> memberVos = iOrganizationService.findUnitMemberVo(memberIds);
                for (UnitMemberVo member : memberVos) {
                    FieldRole role = unitIdToFieldRoleMap.get(member.getUnitId());
                    role.setUnitName(member.getMemberName());
                    role.setAvatar(member.getAvatar());
                    role.setTeams(member.getTeams());
                    memberRoleMap.putIfAbsent(member.getMemberId(), roleCode);
                }
            }
            if (!teamIds.isEmpty()) {
                List<UnitTeamVo> teamVos = iOrganizationService.findUnitTeamVo(spaceId, teamIds);
                for (UnitTeamVo team : teamVos) {
                    FieldRole role = unitIdToFieldRoleMap.get(team.getUnitId());
                    role.setUnitName(team.getTeamName());
                    role.setMemberCount(team.getMemberCount());
                }
                List<Long> teamMemberIds = iTeamService.getMemberIdsByTeamIds(teamIds);
                for (Long teamMemberId : teamMemberIds) {
                    memberRoleMap.putIfAbsent(teamMemberId, roleCode);
                }
            }
        }
        fieldCollaboratorVO.setRoles(ListUtil.toList(unitIdToFieldRoleMap.values()));
        List<FieldRoleMemberVo> members = getFieldRoleMembers(memberRoleMap.keySet());
        members.forEach(member -> {
            member.setRole(memberRoleMap.get(member.getMemberId()));
            member.setIsAdmin(admins.contains(member.getMemberId()));
        });
        fieldCollaboratorVO.setMembers(members);
        return fieldCollaboratorVO;
    }

    private List<FieldRoleMemberVo> getFieldRoleMembers(Collection<Long> memberIds) {
        return memberMapper.selectFieldRoleMemberByIds(memberIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enableFieldRole(Long userId, String dstId, String fldId, boolean includeExtend) {
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fldId);
        String spaceId = iNodeService.getSpaceIdByNodeId(dstId);
        iControlService.create(userId, spaceId, controlId.toString(), controlId.getControlType());
        // 初始化字段权限设置
        iControlSettingService.create(userId, controlId.toString());
        if (includeExtend) {
            addExtendFieldRole(userId, dstId, fldId);
        }
    }

    @Override
    public void addFieldRole(Long userId, String controlId, List<Long> unitIds, String role) {
        log.info("添加字段权限角色。userId:{},controlId:{},role:{},unitIds:{}", userId, controlId, role, unitIds);
        // 过滤组织单元，如果已存在的则修改，未存在的则添加
        List<ControlRoleEntity> controlRoles = iControlRoleService.getByControlId(controlId);
        // 无已存在的组织单元，全部新增
        if (CollUtil.isEmpty(controlRoles)) {
            iControlRoleService.addControlRole(userId, controlId, unitIds, role);
            return;
        }
        Map<Long, String> unitRoleMap = controlRoles.stream()
                .collect(Collectors.toMap(ControlRoleEntity::getUnitId, ControlRoleEntity::getRoleCode));
        List<Long> addUnitIds = new ArrayList<>();
        List<Long> updateUnitIds = new ArrayList<>();
        for (Long unitId : unitIds) {
            if (!unitRoleMap.containsKey(unitId)) {
                // 不存在，新增此组织单元的角色
                addUnitIds.add(unitId);
            }
            else if (!unitRoleMap.get(unitId).equals(role)) {
                // 存在且角色不一样，修改此组织单元的角色
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
        log.info("更新字段「{}」下组织单元「{}」的角色权限「{}」", controlId, unitIds, role);
        // 原组织单元在列的角色
        Map<Long, String> unitIdToRoleCode = iControlRoleService.getUnitIdToRoleCodeMapWithoutOwnerRole(controlId, unitIds);
        if (unitIdToRoleCode.keySet().size() != unitIds.size()) {
            throw new BusinessException(PermissionException.FIELD_ROLE_NOT_EXIST);
        }
        List<Long> subUnitIds = unitIds.stream()
                .filter(unitId -> !role.equals(unitIdToRoleCode.get(unitId)))
                .collect(toList());
        // 修改
        iControlRoleService.editControlRole(userId, controlId, subUnitIds, role);
    }

    @Override
    public String deleteFieldRole(String controlId, String datasheetId, Long unitId) {
        log.info("删除字段「{}」权限角色「{}」", controlId, unitId);
        String roleCode = iControlRoleService.getRoleCodeByControlIdAndUnitId(controlId, unitId);
        if (roleCode == null) {
            throw new BusinessException(PermissionException.FIELD_ROLE_NOT_EXIST);
        }
        iControlRoleService.removeByControlIdAndUnitId(controlId, unitId);
        return roleCode;
    }

    @Override
    public void updateFieldRoleProp(Long userId, String controlId, FieldControlProp prop) {
        log.info("更改控制权限的设置");
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
                log.info("更新配置成功");
            }
        }
        catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new BusinessException(PermissionException.UPDATE_FIELD_ROLE_SETTING);
        }
    }

    @Override
    public FieldPermissionView getFieldPermissionView(Long memberId, String nodeId, String shareId) {
        log.info("成员「{}」获取节点「{}」的字段权限，分享ID:「{}」", memberId, nodeId, shareId);
        NodeType type = iNodeService.getTypeByNodeId(nodeId);
        String datasheetId;
        switch (type) {
            case DATASHEET:
                datasheetId = nodeId;
                break;
            case FORM:
            case MIRROR:
                Map<String, String> formToDatasheetMap = iNodeRelService.getRelNodeToMainNodeMap(Collections.singletonList(nodeId));
                if (MapUtil.isEmpty(formToDatasheetMap) || !formToDatasheetMap.containsKey(nodeId)) {
                    return null;
                }
                datasheetId = formToDatasheetMap.get(nodeId);
                break;
            default:
                return null;
        }
        List<String> controlIds = iControlService.getControlIdByControlIdPrefixAndType(datasheetId, ControlType.DATASHEET_FIELD.getVal());
        if (controlIds == null || controlIds.isEmpty()) {
            return new FieldPermissionView(nodeId, datasheetId, null);
        }
        Map<String, String> controlIdToFieldIdMap = controlIds.stream()
                .collect(Collectors.toMap(String::toString, controlId -> controlId.substring(controlId.indexOf(ControlIdBuilder.SYMBOL) + 1)));
        // 在分享中加载字段权限
        if (StrUtil.isNotBlank(shareId)) {
            // 非收集表的情景，直接返回已设置了权限的字段
            if (type != NodeType.FORM) {
                Map<String, FieldPermissionInfo> permissionInfoMap = controlIdToFieldIdMap.values().stream()
                        .collect(Collectors.toMap(String::toString, fieldId -> FieldPermissionInfo.builder()
                                .fieldId(fieldId)
                                .permission(new FieldPermission())
                                .build()));
                return new FieldPermissionView(nodeId, datasheetId, permissionInfoMap);
            }
            // 收集表，增加返回字段权限配置属性
            List<ControlSettingEntity> controlSettingEntities = iControlSettingService.getBatchByControlIds(controlIds);
            Map<String, ControlSettingEntity> controlSettingEntityMap = controlSettingEntities.stream()
                    .collect(Collectors.toMap(ControlSettingEntity::getControlId, Function.identity()));
            Map<String, FieldPermissionInfo> permissionInfoMap = controlIdToFieldIdMap.entrySet().stream()
                    .collect(Collectors.toMap(Map.Entry::getValue, entry -> FieldPermissionInfo.builder()
                            .fieldId(entry.getValue())
                            .setting(JSONUtil.toBean(controlSettingEntityMap.get(entry.getKey()).getProps(), FieldRoleSetting.class))
                            .permission(new FieldPermission())
                            .build()));
            return new FieldPermissionView(nodeId, datasheetId, permissionInfoMap);
        }
        // 站内加载
        // 获取权限角色集
        ControlRoleDict roleDict = controlTemplate.fetchFieldRole(memberId, datasheetId, ListUtil.list(true, controlIdToFieldIdMap.values()));
        // 获取权限配置属性
        List<ControlSettingEntity> controlSettingEntities = iControlSettingService.getBatchByControlIds(controlIds);
        Map<String, String> controlIdToPropsMap = controlSettingEntities.stream()
                .collect(Collectors.toMap(ControlSettingEntity::getControlId, ControlSettingEntity::getProps));
        Map<String, Long> controlId2Creator = controlSettingEntities.stream()
                .collect(Collectors.toMap(ControlSettingEntity::getControlId, ControlSettingEntity::getUpdatedBy));
        Long userId = memberMapper.selectUserIdByMemberId(memberId);
        Map<String, FieldPermissionInfo> permissionInfoMap = controlIdToFieldIdMap.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getValue, entry -> {
                    FieldPermissionInfo fieldPermissionInfo = new FieldPermissionInfo();
                    fieldPermissionInfo.setFieldId(entry.getValue());
                    fieldPermissionInfo.setSetting(JSONUtil.toBean(controlIdToPropsMap.get(entry.getKey()), FieldRoleSetting.class));
                    if (roleDict.containsKey(entry.getValue())) {
                        ControlRole role = roleDict.get(entry.getValue());
                        fieldPermissionInfo.setHasRole(true);
                        fieldPermissionInfo.setRole(role.getRoleTag());
                        // 新增当前用户是否可管理这个权限
                        fieldPermissionInfo.setManageable(role.isAdmin() || controlId2Creator.get(entry.getKey()).equals(userId));
                        fieldPermissionInfo.setPermission(role.permissionToBean(FieldPermission.class));
                    }
                    else {
                        fieldPermissionInfo.setPermission(new FieldPermission());
                    }
                    return fieldPermissionInfo;
                }));

        return new FieldPermissionView(nodeId, datasheetId, permissionInfoMap);
    }

    @Override
    public Map<String, FieldPermissionInfo> getFieldPermissionMap(Long memberId, String nodeId, String shareId) {
        FieldPermissionView view = this.getFieldPermissionView(memberId, nodeId, shareId);
        if (view != null) {
            return view.getFieldPermissionMap();
        }
        return null;
    }

    @Override
    public List<String> getPermissionFieldIds(String datasheetId) {
        List<String> controlIds = iControlService.getControlIdByControlIdPrefixAndType(datasheetId, ControlType.DATASHEET_FIELD.getVal());
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
            return CollUtil.newHashMap();
        }
        log.info("删除字段「{}」权限角色「{}」", controlId, unitIds);
        List<ControlRoleInfo> controlRole = iControlRoleService.getUnitRoleByControlIdAndUnitIds(controlId, unitIds);
        Map<String, List<Long>> roleToUnitIds = controlRole.stream()
                .collect(groupingBy(ControlRoleInfo::getRole, mapping(ControlRoleInfo::getUnitId, toList())));
        List<Long> existUnitIds = roleToUnitIds.values().stream().flatMap(Collection::stream).collect(toList());
        if (CollUtil.isEmpty(existUnitIds)) {
            return roleToUnitIds;
        }
        iControlRoleService.removeByControlIdAndUnitIds(controlId, existUnitIds);
        return roleToUnitIds;
    }

    private void addExtendFieldRole(Long userId, String dstId, String fldId) {
        String spaceId = iNodeService.getSpaceIdByNodeId(dstId);
        ControlId controlId = ControlIdBuilder.fieldId(dstId, fldId);
        Map<String, List<Long>> fieldRoleToUnitIdsMap = getDefaultFiledRoleToUnitIdsMap(spaceId, dstId);
        fieldRoleToUnitIdsMap.forEach((role, unitIds) -> {
            // 添加角色
            addFieldRole(userId, controlId.toString(), unitIds, role);
        });
    }

    private Map<String, List<Long>> getDefaultFiledRoleToUnitIdsMap(String spaceId, String dstId) {
        Map<String, Set<Long>> nodeRoleToUnitIds = iNodeRoleService.getRoleToUnitIds(false, spaceId, dstId);
        Map<String, List<Long>> fieldRoleToUnitIds = new HashMap<>(2);
        if (nodeRoleToUnitIds.containsKey(Node.READER)) {
            Set<Long> readUnitIds = nodeRoleToUnitIds.get(Node.READER);
            boolean haveOwner = nodeRoleToUnitIds.containsKey(Node.OWNER) && nodeRoleToUnitIds.get(Node.OWNER).stream().findFirst().isPresent();
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

    private List<FieldRole> getDefaultFieldRoles(String spcId, String dstId) {
        List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spcId);
        // 记载所有成员对应角色
        List<FieldRole> fieldRoles = new ArrayList<>(16);
        List<UnitMemberVo> unitMemberVos = iOrganizationService.findUnitMemberVo(admins);
        Set<Long> adminIds = new HashSet<>();
        for (UnitMemberVo member : unitMemberVos) {
            boolean isAdmin = admins.contains(member.getMemberId());
            FieldRole role = getFieldRole(isAdmin, member, false);
            adminIds.add(member.getUnitId());
            fieldRoles.add(role);
        }
        // 获取字段所在数表而来的继承角色
        fieldRoles.addAll(getDefaultExtendRole(spcId, dstId, adminIds));
        return fieldRoles;
    }

    private List<FieldRole> getDefaultExtendRole(String spcId, String dstId, Set<Long> adminIds) {
        Map<String, List<Long>> filedRoleToUnitIds = getDefaultFiledRoleToUnitIdsMap(spcId, dstId);
        List<FieldRole> fieldRoles = new ArrayList<>(16);
        Map<Long, FieldRole> unitIdToFieldRoleMap = new HashMap<>(16);
        List<Long> teamIds = new ArrayList<>();
        List<Long> memberIds = new ArrayList<>();
        filedRoleToUnitIds.forEach((role, unitIds) -> {
            // node的owner转化而来字段的editor，它可能是管理员。
            unitIds.removeAll(adminIds);
            if (unitIds.isEmpty()) {
                return;
            }
            List<UnitEntity> units = unitMapper.selectByUnitIds(unitIds);
            units.forEach(unit -> {
                FieldRole fieldRole = new FieldRole();
                fieldRole.setRole(role);
                fieldRole.setUnitId(unit.getId());
                fieldRole.setUnitType(unit.getUnitType());
                List<Long> unitRefIds =
                        UnitType.TEAM.getType().equals(unit.getUnitType()) ? teamIds : memberIds;
                unitRefIds.add(unit.getUnitRefId());
                unitIdToFieldRoleMap.putIfAbsent(unit.getId(), fieldRole);
                fieldRoles.add(fieldRole);
            });
        });
        // 批量查询补充组织单元信息
        if (!teamIds.isEmpty()) {
            List<UnitTeamVo> teamVos = iOrganizationService.findUnitTeamVo(spcId, teamIds);
            for (UnitTeamVo team : teamVos) {
                FieldRole unit = unitIdToFieldRoleMap.get(team.getUnitId());
                unit.setUnitName(team.getTeamName());
                unit.setMemberCount(team.getMemberCount());
            }
        }
        if (!memberIds.isEmpty()) {
            List<UnitMemberVo> memberVos = iOrganizationService.findUnitMemberVo(memberIds);
            for (UnitMemberVo member : memberVos) {
                FieldRole unit = unitIdToFieldRoleMap.get(member.getUnitId());
                unit.setUnitName(member.getMemberName());
                unit.setAvatar(member.getAvatar());
                unit.setTeams(member.getTeams());
            }
        }
        return fieldRoles;
    }

    private FieldRole getFieldRole(boolean isAdmin, UnitMemberVo member, boolean isOwner) {
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
}
