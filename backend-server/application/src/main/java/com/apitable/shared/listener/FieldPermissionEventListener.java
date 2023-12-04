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

package com.apitable.shared.listener;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.base.service.RestTemplateService;
import com.apitable.control.infrastructure.ControlIdBuilder;
import com.apitable.control.infrastructure.ControlIdBuilder.ControlId;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.FieldEditorRole;
import com.apitable.control.infrastructure.role.RoleConstants.Field;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.control.service.IControlRoleService;
import com.apitable.control.service.IControlService;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.shared.listener.event.FieldPermissionEvent;
import com.apitable.shared.listener.event.FieldPermissionEvent.Arg;
import com.apitable.shared.util.MultiValueMapUtils;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.workspace.dto.ControlRoleUnitDTO;
import com.apitable.workspace.dto.MemberInfoDTO;
import com.apitable.workspace.ro.FieldPermissionChangeNotifyRo;
import com.apitable.workspace.ro.FieldPermissionChangeNotifyRo.ChangeObject;
import com.apitable.workspace.service.INodeRoleService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.FieldPermission;
import com.apitable.workspace.vo.FieldRoleSetting;
import com.apitable.workspace.vo.NodeRoleMemberVo;
import jakarta.annotation.Resource;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * <p>
 * Field permission event listener.
 * </p>
 *
 * @author Chambers
 */
@Slf4j
@Component
public class FieldPermissionEventListener implements ApplicationListener<FieldPermissionEvent> {

    @Resource
    private INodeService iNodeService;

    @Resource
    private INodeRoleService iNodeRoleService;

    @Resource
    private IControlService iControlService;

    @Resource
    private IControlRoleService iControlRoleService;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private RestTemplateService restTemplateService;

    @Override
    @Async
    public void onApplicationEvent(FieldPermissionEvent event) {
        Arg arg = event.getArg();
        FieldPermissionChangeNotifyRo notifyRo =
            BeanUtil.copyProperties(arg, FieldPermissionChangeNotifyRo.class);
        notifyRo.setChangeTime(Instant.now(Clock.system(ZoneId.of("+8"))).toEpochMilli());
        switch (arg.getEvent()) {
            case FIELD_PERMISSION_ENABLE:
                // Open permission settings
                String spaceId = iNodeService.getSpaceIdByNodeId(arg.getDatasheetId());
                // Get a list of change notification objects
                List<ChangeObject> changes = getChangeObjects(arg, spaceId);
                notifyRo.setChanges(changes);
                // Column permission is turned on by default, collection table writing is turned off
                FieldRoleSetting fieldRoleSetting = new FieldRoleSetting();
                fieldRoleSetting.setFormSheetAccessible(false);
                notifyRo.setSetting(fieldRoleSetting);
                break;
            case FIELD_PERMISSION_CHANGE:
                List<Long> unitIds =
                    arg.getChangedUnitIds() != null ? ListUtil.toList(arg.getChangedUnitIds()) :
                        arg.getDelUnitIds();
                if (unitIds.isEmpty()) {
                    return;
                }
                // Get all member IDs under the organizational unit. If there are no members,
                // it means that there will be no affected users, and end directly
                List<Long> memberIds = iUnitService.getMembersIdByUnitIds(unitIds);
                if (memberIds.isEmpty()) {
                    return;
                }
                // get space workbench admin
                List<Long> spaceAdmins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(
                    iNodeService.getSpaceIdByNodeId(arg.getDatasheetId()));
                // Changes to space workbench administrators do not result in permission changes, filtering
                spaceAdmins.stream().filter(memberIds::contains).forEach(memberIds::remove);
                if (memberIds.isEmpty()) {
                    return;
                }
                // get column permission opener
                ControlId controlId =
                    ControlIdBuilder.fieldId(arg.getDatasheetId(), arg.getFieldId());
                Long ownerMemberId = iControlService.getOwnerMemberId(controlId.toString());
                if (ownerMemberId != null) {
                    spaceAdmins.add(ownerMemberId);
                    memberIds.remove(ownerMemberId);
                    if (memberIds.isEmpty()) {
                        return;
                    }
                }
                // load member information
                List<MemberInfoDTO> members = memberMapper.selectMemberInfoDTOByIds(memberIds);
                Map<Long, String> memberIdToUuidMap =
                    members.stream().filter(info -> info.getUuid() != null)
                        .collect(Collectors.toMap(MemberInfoDTO::getId, MemberInfoDTO::getUuid));
                // no active members exist just end
                if (memberIdToUuidMap.isEmpty()) {
                    return;
                }
                ControlRole fieldRole = ControlRoleManager.parseFieldRole(arg.getRole());
                Map<String, List<String>> roleToUuidsMap = new HashMap<>(3);
                String noRoleKey = "";
                // field permission roles of members after getting the organizational unit that filters changes
                Map<Long, ControlRole> memberRoleMap =
                    this.getFilterMemberRoleMap(controlId, spaceAdmins, unitIds);
                if (arg.getRole() != null && arg.getChangedUnitIds() != null) {
                    // Add or modify field roles, and the changed role permissions are created from scratch,
                    // or broadcast only when they become higher (for example, the original editable permissions are already available, and another organizational unit setting brings viewing permissions, no need to broadcast)
                    for (Entry<Long, String> entry : memberIdToUuidMap.entrySet()) {
                        if (memberRoleMap.containsKey(entry.getKey())
                            && memberRoleMap.get(entry.getKey()).isGreaterThan(fieldRole)) {
                            continue;
                        }
                        MultiValueMapUtils.accumulatedValueIfAbsent(roleToUuidsMap, arg.getRole(),
                            entry.getValue());
                    }
                } else if (CollUtil.isNotEmpty(arg.getDelUnitIds())) {
                    // After the specified organizational unit role is deleted,
                    // the changed role permissions will be broadcast from existence to non-existence, or only if they are reduced.
                    for (Entry<Long, String> entry : memberIdToUuidMap.entrySet()) {
                        if (memberRoleMap.containsKey(entry.getKey())) {
                            ControlRole memberFileRole = memberRoleMap.get(entry.getKey());
                            if (memberFileRole.isLessThan(fieldRole)) {
                                MultiValueMapUtils.accumulatedValueIfAbsent(roleToUuidsMap,
                                    memberFileRole.getRoleTag(), entry.getValue());
                            }
                        } else {
                            MultiValueMapUtils.accumulatedValueIfAbsent(roleToUuidsMap, noRoleKey,
                                entry.getValue());
                        }
                    }
                }
                if (roleToUuidsMap.isEmpty()) {
                    return;
                }
                List<ChangeObject> objects = new ArrayList<>(roleToUuidsMap.size());
                for (Entry<String, List<String>> entry : roleToUuidsMap.entrySet()) {
                    if (entry.getKey().equals(noRoleKey)) {
                        objects.add(
                            new ChangeObject(entry.getValue(), noRoleKey, new FieldPermission()));
                    } else {
                        ControlRole controlRole = ControlRoleManager.parseFieldRole(entry.getKey());
                        objects.add(new ChangeObject(entry.getValue(), controlRole.getRoleTag(),
                            controlRole.permissionToBean(FieldPermission.class)));
                    }
                }
                notifyRo.setChanges(objects);
                break;
            default:
                break;
        }
        restTemplateService.fieldPermissionChangeNotify(notifyRo);
    }

    private List<ChangeObject> getChangeObjects(Arg arg, String spaceId) {
        // Get the data table corresponding to the node that actually has role permissions
        String nodeId = iNodeRoleService.getClosestEnabledRoleNode(arg.getDatasheetId());
        // check all members of a node
        List<NodeRoleMemberVo> roleMembers =
            nodeId == null ? iNodeRoleService.getNodeRoleMembers(spaceId)
                : iNodeRoleService.getNodeRoleMembers(spaceId, nodeId);
        // With the node manageable group, take out the corresponding user uuid
        Map<Boolean, List<String>> isManagerToUuidsMap = roleMembers.stream()
            .filter(vo -> vo.getUuid() != null
                && (vo.getIsWorkbenchAdmin() || !vo.getUuid().equals(arg.getUuid())))
            .collect(Collectors.groupingBy(vo -> {
                if (BooleanUtil.isFalse(arg.getIncludeExtend())) {
                    return vo.getIsWorkbenchAdmin().equals(Boolean.TRUE);
                }
                return vo.getIsWorkbenchAdmin().equals(Boolean.TRUE)
                    || ControlRoleManager.parseNodeRole(vo.getRole())
                    .isGreaterThan(ControlRoleManager.parseNodeRole(Node.READER));
            }, Collectors.mapping(NodeRoleMemberVo::getUuid, Collectors.toList())));

        List<ChangeObject> changes = new ArrayList<>(isManagerToUuidsMap.size());
        // If include Extend is false: Broadcast the column editable permission set to workbench administrators and column permission enablers.
        // If include Extend is true: broadcasts the column editable permission set to workbench administrators or node permissions greater than readers, and column permission openers.
        isManagerToUuidsMap.get(true).add(arg.getUuid());
        ControlRole role = ControlRoleManager.parseFieldRole(Field.EDITOR);
        changes.add(new ChangeObject(isManagerToUuidsMap.get(true), role.getRoleTag(),
            role.permissionToBean(FieldPermission.class)));
        if (isManagerToUuidsMap.containsKey(false)) {
            // If include Extend is false: members of other permissions broadcast an empty permission set.
            // If include Extend is true: the read permission set of the broadcast column is equal to the read permission of the node.
            String defaultRole =
                BooleanUtil.isFalse(arg.getIncludeExtend()) ? StrUtil.EMPTY : Field.READER;
            changes.add(new ChangeObject(isManagerToUuidsMap.get(false), defaultRole,
                new FieldPermission()));
        }
        return changes;
    }

    private Map<Long, ControlRole> getFilterMemberRoleMap(ControlId controlId, List<Long> admins,
                                                          Collection<Long> changedUnitIds) {
        // build member role mappings
        Map<Long, ControlRole> memberRoleMap = new HashMap<>(16);
        FieldEditorRole editorRole = new FieldEditorRole();

        // Workbench admin and owner column permission role is Edit
        admins.forEach(admin -> memberRoleMap.put(admin, editorRole));

        // get permission set information
        List<ControlRoleUnitDTO> controlRoles =
            iControlRoleService.getControlRolesUnitDtoByControlId(controlId.toString());
        if (controlRoles.isEmpty()) {
            return memberRoleMap;
        }
        // Filter org units with no changes and administrators
        Map<String, List<ControlRoleUnitDTO>> fieldRoleControlMap = controlRoles.stream()
            .filter(dto -> !changedUnitIds.contains(dto.getUnitId())
                && !admins.contains(dto.getUnitRefId()))
            .sorted(Comparator.comparing(
                (Function<ControlRoleUnitDTO, Long>) t -> ControlRoleManager.parseFieldRole(
                    t.getRole()).getBits()).reversed())
            .collect(groupingBy(ControlRoleUnitDTO::getRole, LinkedHashMap::new, toList()));
        if (fieldRoleControlMap.isEmpty()) {
            return memberRoleMap;
        }
        for (Map.Entry<String, List<ControlRoleUnitDTO>> entry : fieldRoleControlMap.entrySet()) {
            List<Long> teamIds = new ArrayList<>();
            ControlRole fieldRole = ControlRoleManager.parseFieldRole(entry.getKey());
            for (ControlRoleUnitDTO control : entry.getValue()) {
                UnitType unitType = UnitType.toEnum(control.getUnitType());
                if (unitType == UnitType.TEAM) {
                    teamIds.add(control.getUnitRefId());
                } else if (unitType == UnitType.MEMBER) {
                    memberRoleMap.putIfAbsent(control.getUnitRefId(), fieldRole);
                }
            }
            //batch query member ids under departments
            if (!teamIds.isEmpty()) {
                List<Long> teamMemberIds = iTeamService.getMemberIdsByTeamIds(teamIds);
                for (Long teamMemberId : teamMemberIds) {
                    memberRoleMap.putIfAbsent(teamMemberId, fieldRole);
                }
            }
        }
        return memberRoleMap;
    }
}
