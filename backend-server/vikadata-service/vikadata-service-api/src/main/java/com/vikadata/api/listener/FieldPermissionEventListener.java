package com.vikadata.api.listener;

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

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.control.ControlIdBuilder;
import com.vikadata.api.control.ControlIdBuilder.ControlId;
import com.vikadata.api.control.role.ControlRole;
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.FieldEditorRole;
import com.vikadata.api.control.role.RoleConstants.Field;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.event.FieldPermissionEvent;
import com.vikadata.api.event.FieldPermissionEvent.Arg;
import com.vikadata.api.model.ro.datasheet.FieldPermissionChangeNotifyRo;
import com.vikadata.api.model.ro.datasheet.FieldPermissionChangeNotifyRo.ChangeObject;
import com.vikadata.api.model.vo.datasheet.FieldRoleSetting;
import com.vikadata.api.model.vo.node.FieldPermission;
import com.vikadata.api.model.vo.node.NodeRoleMemberVo;
import com.vikadata.api.modular.base.service.RestTemplateService;
import com.vikadata.api.modular.control.service.IControlRoleService;
import com.vikadata.api.modular.control.service.IControlService;
import com.vikadata.api.modular.organization.model.MemberBaseInfoDTO;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.workspace.model.ControlRoleUnitDTO;
import com.vikadata.api.modular.workspace.service.INodeRoleService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.MultiValueMapUtils;

import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import static com.vikadata.api.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;

/**
 * <p>
 * 字段权限事件监听器
 * </p>
 *
 * @author Chambers
 * @date 2021/4/1
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
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    public void onApplicationEvent(FieldPermissionEvent event) {
        Arg arg = event.getArg();
        FieldPermissionChangeNotifyRo notifyRo = BeanUtil.copyProperties(arg, FieldPermissionChangeNotifyRo.class);
        notifyRo.setChangeTime(Instant.now(Clock.system(ZoneId.of("+8"))).toEpochMilli());
        switch (arg.getEvent()) {
            case FIELD_PERMISSION_ENABLE:
                // 开启权限设置
                String spaceId = iNodeService.getSpaceIdByNodeId(arg.getDatasheetId());
                // 获取变更通知对象列表
                List<ChangeObject> changes = getChangeObjects(arg, spaceId);
                notifyRo.setChanges(changes);
                // 列权限开启默认关闭收集表写入
                FieldRoleSetting fieldRoleSetting = new FieldRoleSetting();
                fieldRoleSetting.setFormSheetAccessible(false);
                notifyRo.setSetting(fieldRoleSetting);
                break;
            case FIELD_PERMISSION_CHANGE:
                List<Long> unitIds = arg.getChangedUnitIds() != null ? ListUtil.toList(arg.getChangedUnitIds()) : arg.getDelUnitIds();
                if (unitIds.isEmpty()) {
                    return;
                }
                // 获取组织单元下所有的成员ID，若无成员则代表不会有受影响的用户，直接结束
                List<Long> memberIds = iUnitService.getMembersIdByUnitIds(unitIds);
                if (memberIds.isEmpty()) {
                    return;
                }
                // 获取空间工作台管理员
                List<Long> spaceAdmins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(iNodeService.getSpaceIdByNodeId(arg.getDatasheetId()));
                // 对空间工作台管理员的变更不会产生权限变化，过滤
                spaceAdmins.stream().filter(memberIds::contains).forEach(memberIds::remove);
                if (memberIds.isEmpty()) {
                    return;
                }
                // 获取列权限开启者
                ControlId controlId = ControlIdBuilder.fieldId(arg.getDatasheetId(), arg.getFieldId());
                Long ownerMemberId = iControlService.getOwnerMemberId(controlId.toString());
                if (ownerMemberId != null) {
                    spaceAdmins.add(ownerMemberId);
                    memberIds.remove(ownerMemberId);
                    if (memberIds.isEmpty()) {
                        return;
                    }
                }
                // 加载成员信息
                List<MemberBaseInfoDTO> members = memberMapper.selectBaseInfoDTOByIds(memberIds);
                Map<Long, String> memberIdToUuidMap = members.stream().filter(info -> info.getUuid() != null)
                    .collect(Collectors.toMap(MemberBaseInfoDTO::getId, MemberBaseInfoDTO::getUuid));
                // 不存在已激活的成员，直接结束
                if (memberIdToUuidMap.isEmpty()) {
                    return;
                }
                ControlRole fieldRole = ControlRoleManager.parseFieldRole(arg.getRole());
                Map<String, List<String>> roleToUuidsMap = new HashMap<>(3);
                String noRoleKey = "";
                // 获取过滤变更的组织单元后，成员的列权限角色
                Map<Long, ControlRole> memberRoleMap = this.getFilterMemberRoleMap(controlId, spaceAdmins, unitIds);
                if (arg.getRole() != null && arg.getChangedUnitIds() != null) {
                    // 新增或修改字段角色，变更后的角色权限从无到有，或者变高了的才广播（例如原来已有可编辑权限，另外一个组织单元设置带来了可查看权限，无需广播）
                    for (Entry<Long, String> entry : memberIdToUuidMap.entrySet()) {
                        if (memberRoleMap.containsKey(entry.getKey()) && memberRoleMap.get(entry.getKey()).isGreaterThan(fieldRole)) {
                            continue;
                        }
                        MultiValueMapUtils.accumulatedValueIfAbsent(roleToUuidsMap, arg.getRole(), entry.getValue());
                    }
                }
                else if (CollUtil.isNotEmpty(arg.getDelUnitIds())) {
                    // 删除了指定组织单元角色后，变更后的角色权限从有到无，或者降低了的才广播
                    for (Entry<Long, String> entry : memberIdToUuidMap.entrySet()) {
                        if (memberRoleMap.containsKey(entry.getKey())) {
                            ControlRole memberFileRole = memberRoleMap.get(entry.getKey());
                            if (memberFileRole.isLessThan(fieldRole)) {
                                MultiValueMapUtils.accumulatedValueIfAbsent(roleToUuidsMap, memberFileRole.getRoleTag(), entry.getValue());
                            }
                        }
                        else {
                            MultiValueMapUtils.accumulatedValueIfAbsent(roleToUuidsMap, noRoleKey, entry.getValue());
                        }
                    }
                }
                if (roleToUuidsMap.size() == 0) {
                    return;
                }
                List<ChangeObject> objects = new ArrayList<>(roleToUuidsMap.size());
                for (Entry<String, List<String>> entry : roleToUuidsMap.entrySet()) {
                    if (entry.getKey().equals(noRoleKey)) {
                        objects.add(new ChangeObject(entry.getValue(), noRoleKey, new FieldPermission()));
                    }
                    else {
                        ControlRole controlRole = ControlRoleManager.parseFieldRole(entry.getKey());
                        objects.add(new ChangeObject(entry.getValue(), controlRole.getRoleTag(), controlRole.permissionToBean(FieldPermission.class)));
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
        // 获取数表对应真实具备角色权限所在节点
        String nodeId = iNodeRoleService.getClosestEnabledRoleNode(arg.getDatasheetId());
        // 查节点的所有成员
        List<NodeRoleMemberVo> roleMembers =
            nodeId == null ? iNodeRoleService.getNodeRoleMembers(spaceId)
                : iNodeRoleService.getNodeRoleMembers(spaceId, nodeId);
        // 以节点可管理分组，取出对应用户的 uuid
        Map<Boolean, List<String>> isManagerToUuidsMap = roleMembers.stream()
            .filter(vo -> vo.getUuid() != null && (vo.getIsAdmin() || !vo.getUuid().equals(arg.getUuid())))
            .collect(Collectors.groupingBy(vo -> {
                    if (BooleanUtil.isFalse(arg.getIncludeExtend())) {
                        return vo.getIsAdmin().equals(Boolean.TRUE);
                    }
                    return vo.getIsAdmin().equals(Boolean.TRUE) || ControlRoleManager.parseNodeRole(vo.getRole())
                            .isGreaterThan(ControlRoleManager.parseNodeRole(Node.READER));
                },
                Collectors.mapping(NodeRoleMemberVo::getUuid, Collectors.toList())));

        List<ChangeObject> changes = new ArrayList<>(isManagerToUuidsMap.size());
        // 如果includeExtend为false：向工作台管理员和列权限开启者广播列可编辑权限集。
        // 如果includeExtend为true：向工作台管理员或节点权限大于读者，和列权限开启者广播列可编辑权限集。
        isManagerToUuidsMap.get(true).add(arg.getUuid());
        ControlRole role = ControlRoleManager.parseFieldRole(Field.EDITOR);
        changes.add(new ChangeObject(isManagerToUuidsMap.get(true), role.getRoleTag(), role.permissionToBean(FieldPermission.class)));
        if (isManagerToUuidsMap.containsKey(false)) {
            // 如果includeExtend为false：其他权限的成员广播空权限集。
            // 如果includeExtend为true：等于节点阅读权限的人员广播列可阅读权限集。
            String defaultRole = BooleanUtil.isFalse(arg.getIncludeExtend()) ? StrUtil.EMPTY : Field.READER;
            changes.add(new ChangeObject(isManagerToUuidsMap.get(false), defaultRole, new FieldPermission()));
        }
        return changes;
    }

    private Map<Long, ControlRole> getFilterMemberRoleMap(ControlId controlId, List<Long> admins, Collection<Long> changedUnitIds) {
        // 构建成员角色映射
        Map<Long, ControlRole> memberRoleMap = new HashMap<>(16);
        FieldEditorRole editorRole = new FieldEditorRole();

        // 工作台管理员和 owner 的列权限角色为编辑
        admins.forEach(admin -> memberRoleMap.put(admin, editorRole));

        // 获取权限集信息
        List<ControlRoleUnitDTO> controlRoles = iControlRoleService.getControlRolesUnitDtoByControlId(controlId.toString());
        if (controlRoles.isEmpty()) {
            return memberRoleMap;
        }
        // 过滤不发生变更和管理员的组织单元
        Map<String, List<ControlRoleUnitDTO>> fieldRoleControlMap = controlRoles.stream()
            .filter(dto -> !changedUnitIds.contains(dto.getUnitId()) && !admins.contains(dto.getUnitRefId()))
            .sorted(Comparator.comparing((Function<ControlRoleUnitDTO, Long>) t -> ControlRoleManager.parseFieldRole(t.getRole()).getBits()).reversed())
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
                }
                else if (unitType == UnitType.MEMBER) {
                    memberRoleMap.putIfAbsent(control.getUnitRefId(), fieldRole);
                }
            }
            // 批量查询部门下的成员ID
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
