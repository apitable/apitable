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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.apitable.control.entity.ControlRoleEntity;
import com.apitable.control.infrastructure.ControlType;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.DefaultWorkbenchRole;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.control.service.IControlRoleService;
import com.apitable.control.service.IControlService;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.mapper.MemberMapper;
import com.apitable.organization.mapper.TeamMapper;
import com.apitable.organization.mapper.UnitMapper;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.IOrganizationService;
import com.apitable.organization.service.IRoleMemberService;
import com.apitable.organization.service.IRoleService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.organization.vo.RoleInfoVo;
import com.apitable.organization.vo.UnitMemberVo;
import com.apitable.organization.vo.UnitTeamVo;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.constants.AuditConstants;
import com.apitable.shared.listener.event.AuditSpaceEvent;
import com.apitable.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.apitable.space.enums.AuditSpaceAction;
import com.apitable.space.service.ISpaceRoleService;
import com.apitable.workspace.dto.ControlRoleInfo;
import com.apitable.workspace.dto.ControlRoleUnitDTO;
import com.apitable.workspace.dto.SimpleNodeInfo;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.service.INodeRoleService;
import com.apitable.workspace.vo.NodeRoleMemberVo;
import com.apitable.workspace.vo.NodeRoleUnit;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SpringContextHolder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

@Service
@Slf4j
public class NodeRoleServiceImpl implements INodeRoleService {

    @Resource
    private IOrganizationService iOrganizationService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private UnitMapper unitMapper;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private IControlService iControlService;

    @Resource
    private IControlRoleService iControlRoleService;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private IRoleMemberService iRoleMemberService;

    @Resource
    private IRoleService iRoleService;

    @Resource
    private TeamMapper teamMapper;

    private static SimpleNodeInfo findParentRolesExtend(List<SimpleNodeInfo> simpleNodeInfos, SimpleNodeInfo simpleNodeInfo) {
        SimpleNodeInfo parent = null;
        for (SimpleNodeInfo nodeInfo : simpleNodeInfos) {
            if (simpleNodeInfo.getParentId().equals(nodeInfo.getNodeId())) {
                if (!nodeInfo.getExtend()) {
                    parent = nodeInfo;
                    break;
                }
                else {
                    parent = findParentRolesExtend(simpleNodeInfos, nodeInfo);
                }
            }
        }
        return parent;
    }

    private static SimpleNodeInfo findNode(List<SimpleNodeInfo> nodeTrees, String nodeId) {
        SimpleNodeInfo node = null;
        for (SimpleNodeInfo nodeTree : nodeTrees) {
            if (nodeTree.getNodeId().equals(nodeId)) {
                node = nodeTree;
                break;
            }
        }
        return node;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enableNodeRole(Long userId, String spaceId, String nodeId, boolean includeExtend) {
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        // Enable the node to specify permissions and set the current member organization unit role to Owner
        Long unitId = iUnitService.getUnitIdByRefId(memberId);
        log.info("「{}」open node「{}」specify permissions，and set up units「{}」role「{}」", userId, nodeId, unitId, Node.OWNER);
        // create a permission control unit
        iControlService.create(userId, spaceId, nodeId, ControlType.NODE);
        // create a control unit role
        iControlRoleService.addControlRole(userId, nodeId, Collections.singletonList(unitId), Node.OWNER);
        if (includeExtend) {
            addExtendNodeRole(userId, spaceId, nodeId);
        }
    }

    @Override
    public void disableNodeRole(Long userId, Long memberId, String nodeId) {
        log.info("[{}] close node [{}] Specify permissions", userId, nodeId);
        // delete permission control unit
        iControlService.removeControl(userId, Collections.singletonList(nodeId), false);
    }

    @Override
    public void addNodeRole(Long userId, String nodeId, String role, List<Long> unitIds) {
        log.info("[{}] add the permission role of organization unit [{}] to node [{}] as [{}]", userId, nodeId, unitIds, role);
        // cannot specify modification to node owner
        ExceptionUtil.isFalse(role.equals(Node.OWNER), PermissionException.ADD_NODE_ROLE_ERROR);
        // Filter organizational units, modify those that already exist, and add those that do not exist.
        List<ControlRoleEntity> controlRoles = iControlRoleService.getByControlId(nodeId);
        // No existing organizational units, all new
        if (CollUtil.isEmpty(controlRoles)) {
            iControlRoleService.addControlRole(userId, nodeId, unitIds, role);
            return;
        }
        Map<Long, ControlRoleEntity> unitRoleMap = controlRoles.stream().filter(i -> !i.getRoleCode().equals(Node.OWNER)).collect(Collectors.toMap(ControlRoleEntity::getUnitId, i -> i));

        List<Long> addUnitIds = new ArrayList<>();
        List<Long> updateIds = new ArrayList<>();
        for (Long unitId : unitIds) {
            if (!unitRoleMap.containsKey(unitId)) {
                // Does not exist, add the role of this organizational unit
                addUnitIds.add(unitId);
            }
            else if (!unitRoleMap.get(unitId).getRoleCode().equals(role)) {
                // exists and the roles are different, modify the roles of this organizational unit
                updateIds.add(unitRoleMap.get(unitId).getId());
            }
        }
        if (CollUtil.isNotEmpty(addUnitIds)) {
            iControlRoleService.addControlRole(userId, nodeId, addUnitIds, role);
        }
        if (CollUtil.isNotEmpty(updateIds)) {
            // Specify table ID modification to avoid file administrator modification
            iControlRoleService.editControlRole(userId, updateIds, role);
        }
    }

    @Override
    public void updateNodeRole(Long userId, String nodeId, String role, List<Long> unitIds) {
        log.info("[{}] Modify the permission role of organizational unit [{}] at node [{}] to [{}]", userId, nodeId, unitIds, role);
        // cannot specify modification to node owner
        ExceptionUtil.isFalse(role.equals(Node.OWNER), PermissionException.UPDATE_NODE_ROLE_ERROR);
        iControlRoleService.editControlRole(userId, nodeId, unitIds, role);
        Map<Long, String> unitIdToRoleCode = iControlRoleService.getUnitIdToRoleCodeMapWithoutOwnerRole(nodeId, unitIds);
        List<String> oldRoles = new ArrayList<>(unitIds.size());
        unitIds.forEach(unitId -> oldRoles.add(unitIdToRoleCode.getOrDefault(unitId, StrUtil.EMPTY)));
        // publish space audit events
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.UNIT_IDS, unitIds);
        info.set(AuditConstants.OLD_ROLE, oldRoles);
        info.set(AuditConstants.ROLE, role);
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.UPDATE_NODE_ROLE).userId(userId).nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    @Override
    public void deleteNodeRole(Long userId, String nodeId, Long unitId) {
        log.info("Delete the permission role of node [{}] organizational unit [{}]", nodeId, unitId);
        // Get the original role information of the organizational unit
        List<ControlRoleEntity> controlRoles = iControlRoleService.getByControlIdAndUnitId(nodeId, unitId);
        ExceptionUtil.isNotEmpty(controlRoles, PermissionException.DELETE_NODE_ROLE_ERROR);
        // filter node owner
        List<Long> ids = controlRoles.stream().filter(controlRole -> !controlRole.getRoleCode().equals(Node.OWNER)).map(ControlRoleEntity::getId).collect(Collectors.toList());
        if (CollUtil.isEmpty(ids)) {
            return;
        }
        // The specified table ID is deleted to avoid deleting the file administrator.
        iControlRoleService.removeByIds(ids);
        // publish space audit events
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.UNIT_ID, unitId);
        info.set(AuditConstants.OLD_ROLE, controlRoles.stream().filter(controlRole -> !controlRole.getRoleCode().equals(Node.OWNER))
                .findFirst().map(ControlRoleEntity::getRoleCode).orElse(StrUtil.EMPTY));
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DELETE_NODE_ROLE).userId(userId).nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    @Override
    public List<ControlRoleInfo> deleteNodeRoles(String nodeId, List<Long> unitIds) {
        log.info("Delete the permission role of node [{}] organizational unit [{}]", nodeId, unitIds);
        // Get the original role information of the organizational unit
        List<ControlRoleInfo> exitControlRole = iControlRoleService.getUnitRoleByControlIdAndUnitIds(nodeId, unitIds);
        // filter node owner
        List<ControlRoleInfo> controlRoles = exitControlRole.stream().filter(controlRole -> !controlRole.getRole().equals(Node.OWNER)).collect(toList());
        List<Long> exitUnitIds = controlRoles.stream().map(ControlRoleInfo::getUnitId).collect(toList());
        iControlRoleService.removeByControlIdAndUnitIds(nodeId, exitUnitIds);
        return controlRoles;
    }

    /**
     * get the owner of the node
     *
     * @param nodeId node id
     * @return Principal organization unit ID
     */
    private Long getNodeOwnerId(String nodeId) {
        Long ownerUnitId = iControlRoleService.getUnitIdByControlIdAndRoleCode(nodeId, Node.OWNER);
        return ownerUnitId != null ? unitMapper.selectRefIdById(ownerUnitId) : null;
    }

    @Override
    public UnitMemberVo getNodeOwner(String nodeId) {
        log.info("query the owner of the node");
        Long ownerId = getNodeOwnerId(nodeId);
        if (ownerId != null) {
            String spaceId = nodeMapper.selectSpaceIdByNodeId(nodeId);
            List<UnitMemberVo> unitMemberVos = iOrganizationService.findUnitMemberVo(Collections.singletonList(ownerId));
            this.handleNodeMemberTeamName(unitMemberVos, spaceId);
            return CollUtil.isNotEmpty(unitMemberVos) ? CollUtil.getFirst(unitMemberVos) : null;
        }
        return null;
    }

    @Override
    public void handleNodeMemberTeamName(List<UnitMemberVo> unitMemberVos, String spaceId) {
        List<Long> memberIds = unitMemberVos.stream().map(UnitMemberVo::getMemberId).collect(toList());
        // handle member's team name, get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap = iTeamService.batchGetFullHierarchyTeamNames(memberIds, spaceId);
        for (UnitMemberVo unitMemberVo : unitMemberVos) {
            if (memberToTeamPathInfoMap.containsKey(unitMemberVo.getMemberId())) {
                unitMemberVo.setTeamData(memberToTeamPathInfoMap.get(unitMemberVo.getMemberId()));
            }
        }
    }

    @Override
    public void deleteByNodeId(Long userId, List<String> nodeIds) {
        log.info("delete all roles of the node");
        List<String> existedControlIds = iControlService.getExistedControlId(nodeIds);
        if (existedControlIds.isEmpty()) {
            return;
        }
        iControlService.removeControl(userId, nodeIds, false);
    }

    @Override
    public String getClosestEnabledRoleNode(String nodeId) {
        log.info("get node");
        boolean assignMode = this.getNodeRoleIfEnabled(nodeId);
        // Node non-inherited mode, directly returns
        if (assignMode) {
            return nodeId;
        }
        // Gets the node ID inherited by the node
        return getNodeExtendNodeId(nodeId);
    }

    @Override
    public String getNodeExtendNodeId(String nodeId) {
        log.info("Gets the node ID inherited by the node");
        // Query the parent node ID corresponding to the node. In order to improve performance, query all parent nodes at one time to obtain the parent tree structure of the current node.
        List<SimpleNodeInfo> nodeList = nodeMapper.selectAllParentNodeIdsByNodeIds(Collections.singletonList(nodeId), false);
        // Query whether the parent directory has the specified mode
        SimpleNodeInfo node = findNode(nodeList, nodeId);
        SimpleNodeInfo parent = findParentRolesExtend(nodeList, node);
        if (parent == null) {
            // None of the parent nodes have the right to inherit, and return null directly.
            return null;
        }
        return parent.getNodeId();
    }

    @Override
    public boolean getNodeRoleIfEnabled(String nodeId) {
        AtomicReference<Boolean> assign = new AtomicReference<>(false);
        iControlService.checkControlStatus(nodeId, assign::set);
        log.info("Whether node permissions are in the specified mode: [{}]", assign.get());
        return assign.get();
    }

    private Map<String, List<ControlRoleUnitDTO>> groupRoleByNodeId(String nodeId) {
        List<ControlRoleUnitDTO> controlRoles = iControlRoleService.getControlRolesUnitDtoByControlId(nodeId);
        // group by role
        return controlRoles.stream().filter(t -> !t.getRole().equals(Node.OWNER)).sorted(Comparator.comparing((Function<ControlRoleUnitDTO, Long>) t -> ControlRoleManager.parseNodeRole(t.getRole()).getBits()).reversed()).collect(groupingBy(ControlRoleUnitDTO::getRole, LinkedHashMap::new, toList()));
    }

    @Override
    public NodeRoleUnit getRootNodeRoleUnit(String spaceId) {
        NodeRoleUnit unit = new NodeRoleUnit();
        ControlRole defaultWorkbenchRole = new DefaultWorkbenchRole();
        unit.setRole(defaultWorkbenchRole.getRoleTag());
        Long rootTeamId = iTeamService.getRootTeamId(spaceId);
        Long rootTeamUnitId = iTeamService.getRootTeamUnitId(spaceId);
        unit.setUnitId(rootTeamUnitId);
        unit.setUnitType(UnitType.TEAM.getType());
        UnitTeamVo team = iOrganizationService.findUnitTeamVo(spaceId, rootTeamId);
        unit.setUnitRefId(team.getTeamId());
        unit.setUnitName(team.getTeamName());
        unit.setMemberCount(team.getMemberCount());
        return unit;
    }

    @Override
    public List<NodeRoleUnit> getNodeRoleUnitList(String nodeId) {
        log.info("Query the list of organizational units assigned by the role of the specified node");
        String spaceId = nodeMapper.selectSpaceIdByNodeId(nodeId);
        // group by role
        Map<String, List<ControlRoleUnitDTO>> roleUnitMap = groupRoleByNodeId(nodeId);
        List<NodeRoleUnit> roleUnits = new ArrayList<>();
        Map<Long, NodeRoleUnit> unitIdToFieldRoleMap = new HashMap<>(16);
        for (Map.Entry<String, List<ControlRoleUnitDTO>> entry : roleUnitMap.entrySet()) {
            List<Long> teamIds = new ArrayList<>();
            List<Long> memberIds = new ArrayList<>();
            List<Long> roleIds = new ArrayList<>();
            for (ControlRoleUnitDTO nodeRoleDto : entry.getValue()) {
                NodeRoleUnit unit = new NodeRoleUnit();
                unit.setRole(nodeRoleDto.getRole());
                unit.setUnitId(nodeRoleDto.getUnitId());
                unit.setUnitType(nodeRoleDto.getUnitType());
                // save organizational unit and role information
                unitIdToFieldRoleMap.putIfAbsent(nodeRoleDto.getUnitId(), unit);
                UnitType unitType = UnitType.toEnum(nodeRoleDto.getUnitType());
                if (unitType == UnitType.TEAM) {
                    teamIds.add(nodeRoleDto.getUnitRefId());
                }
                else if (unitType == UnitType.MEMBER) {
                    memberIds.add(nodeRoleDto.getUnitRefId());
                }
                else if (unitType == UnitType.ROLE) {
                    roleIds.add(nodeRoleDto.getUnitRefId());
                }
            }
            // Batch query supplementary organizational unit information
            if (!teamIds.isEmpty()) {
                List<UnitTeamVo> teamVos = iOrganizationService.findUnitTeamVo(spaceId, teamIds);
                for (UnitTeamVo team : teamVos) {
                    NodeRoleUnit unit = unitIdToFieldRoleMap.get(team.getUnitId());
                    unit.setUnitRefId(team.getTeamId());
                    unit.setUnitName(team.getTeamName());
                    unit.setMemberCount(team.getMemberCount());
                    roleUnits.add(unit);
                }
            }
            if (!memberIds.isEmpty()) {
                List<UnitMemberVo> memberVos = iOrganizationService.findUnitMemberVo(memberIds);
                // handle member's team name, get full hierarchy team name
                Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap = iTeamService.batchGetFullHierarchyTeamNames(memberIds, spaceId);
                for (UnitMemberVo member : memberVos) {
                    NodeRoleUnit unit = unitIdToFieldRoleMap.get(member.getUnitId());
                    unit.setUnitRefId(member.getMemberId());
                    unit.setUnitName(member.getMemberName());
                    unit.setAvatar(member.getAvatar());
                    unit.setAvatarColor(member.getAvatarColor());
                    unit.setNickName(member.getNickName());
                    unit.setTeams(member.getTeams());
                    if (memberToTeamPathInfoMap.containsKey(member.getMemberId())) {
                        unit.setTeamData(memberToTeamPathInfoMap.get(member.getMemberId()));
                    }
                    roleUnits.add(unit);
                }
            }
            if (!roleIds.isEmpty()) {
                List<RoleInfoVo> roles = iRoleService.getRoleVos(spaceId, roleIds);
                for (RoleInfoVo role : roles) {
                    NodeRoleUnit unit = unitIdToFieldRoleMap.get(role.getUnitId());
                    unit.setUnitRefId(role.getRoleId());
                    unit.setUnitName(role.getRoleName());
                    unit.setMemberCount(role.getMemberCount());
                    roleUnits.add(unit);
                }
            }
        }
        return roleUnits;
    }

    @Override
    public List<NodeRoleMemberVo> getNodeRoleMembers(String spaceId) {
        log.info("load all members of the space");
        List<Long> memberIds = iMemberService.getMemberIdsBySpaceId(spaceId);
        List<NodeRoleMemberVo> results = memberMapper.selectNodeRoleMemberByIds(memberIds);

        // give permission value
        ControlRole defaultControlRole = new DefaultWorkbenchRole();
        List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId);
        results.forEach(result -> {
            result.setRole(defaultControlRole.getRoleTag());
            result.setIsAdmin(admins.contains(result.getMemberId()));
        });

        return results;
    }

    @Override
    public List<NodeRoleMemberVo> getNodeRoleMembers(String spaceId, String nodeId) {
        // administrator
        List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId);
        Long ownerId = this.getNodeOwnerId(nodeId);
        // group by role
        Map<String, List<ControlRoleUnitDTO>> roleUnitMap = groupRoleByNodeId(nodeId);
        Map<String, List<Long>> roleMemberMap = new LinkedHashMap<>(roleUnitMap.size());
        roleMemberMap.put(Node.MANAGER, (List<Long>) CollUtil.union(admins, Collections.singletonList(ownerId)));
        for (Map.Entry<String, List<ControlRoleUnitDTO>> entry : roleUnitMap.entrySet()) {
            List<Long> memberIds = new ArrayList<>();
            List<Long> teamIds = new ArrayList<>();
            List<Long> roleIds = new ArrayList<>();
            for (ControlRoleUnitDTO nodeRoleDto : entry.getValue()) {
                UnitType unitType = UnitType.toEnum(nodeRoleDto.getUnitType());
                if (unitType == UnitType.TEAM) {
                    teamIds.add(nodeRoleDto.getUnitRefId());
                }
                else if (unitType == UnitType.MEMBER) {
                    memberIds.add(nodeRoleDto.getUnitRefId());
                }
                else if (unitType == UnitType.ROLE) {
                    roleIds.add(nodeRoleDto.getUnitRefId());
                }
            }
            if (CollUtil.isNotEmpty(teamIds)) {
                List<Long> teamMemberIds = iTeamService.getMemberIdsByTeamIds(teamIds);
                if (CollUtil.isNotEmpty(teamMemberIds)) {
                    memberIds.addAll(teamMemberIds);
                }
            }
            if (CollUtil.isNotEmpty(roleIds)) {
                List<Long> roleMemberIds = iRoleMemberService.getMemberIdsByRoleIds(roleIds);
                memberIds.addAll(roleMemberIds);
            }
            if (entry.getKey().equals(Node.MANAGER)) {
                List<Long> values = roleMemberMap.get(entry.getKey());
                values.addAll(memberIds);
                roleMemberMap.put(entry.getKey(), values);
            }
            else {
                roleMemberMap.put(entry.getKey(), CollUtil.distinct(memberIds));
            }
        }

        // filter duplicate permissions
        Map<Long, String> memberRoleMap = new LinkedHashMap<>();
        for (Map.Entry<String, List<Long>> entry : roleMemberMap.entrySet()) {
            if (CollUtil.isNotEmpty(entry.getValue())) {
                for (Long memberId : entry.getValue()) {
                    if (!memberRoleMap.containsKey(memberId)) {
                        memberRoleMap.put(memberId, entry.getKey());
                    }
                }
            }
        }

        List<NodeRoleMemberVo> results = memberMapper.selectNodeRoleMemberByIds(memberRoleMap.keySet());

        // give permission value
        results.forEach(result -> {
            result.setRole(memberRoleMap.get(result.getMemberId()));
            result.setIsAdmin(admins.contains(result.getMemberId()));
        });

        return results;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copyExtendNodeRoleIfExtend(Long userId, String spaceId, Long memberId, Collection<String> nodeIds) {
        log.info("copy the role of the inheritance node");
        Long unitId = unitMapper.selectUnitIdByRefId(memberId);
        for (String nodeId : nodeIds) {
            boolean assignMode = this.getNodeRoleIfEnabled(nodeId);
            // node non inheritance mode skip
            if (assignMode) {
                continue;
            }
            // copy the non owner role of the inherited node
            String extendNodeId = getNodeExtendNodeId(nodeId);
            if (extendNodeId == null) {
                continue;
            }
            List<ControlRoleInfo> controlRoleInfos = iControlRoleService.getUnitRoleByControlId(extendNodeId);
            Map<Long, String> unitRoleMap = new HashMap<>(controlRoleInfos.size() + 1);
            for (ControlRoleInfo controlRoleInfo : controlRoleInfos) {
                // The operator's original designated authority and the original person in charge are not reserved for skipping.
                if (controlRoleInfo.getUnitId().equals(unitId) || controlRoleInfo.getRole().equals(Node.OWNER)) {
                    continue;
                }
                unitRoleMap.put(controlRoleInfo.getUnitId(), controlRoleInfo.getRole());
            }
            // set the operator as the person in charge role
            unitRoleMap.put(unitId, Node.OWNER);
            // create a permission control unit
            iControlService.create(userId, spaceId, nodeId, ControlType.NODE);
            // create a control unit role
            iControlRoleService.addControlRole(userId, nodeId, unitRoleMap);
        }
    }

    @Override
    public Map<String, Set<Long>> getRoleToUnitIds(boolean isParent, String spaceId, String nodeId) {
        List<ControlRoleUnitDTO> controlRoleUnits;
        boolean isGetNodeRole = BooleanUtil.isFalse(isParent) && getNodeRoleIfEnabled(nodeId);
        if (isGetNodeRole) {
            controlRoleUnits = iControlRoleService.getControlRolesUnitDtoByControlId(nodeId);
        }
        else {
            String parentNodeId = getNodeExtendNodeId(nodeId);
            if (parentNodeId == null) {
                // No parent node has enabled permissions, default workbench role, load root department information
                ControlRoleUnitDTO defaultWorkbenchRoleUnit = new ControlRoleUnitDTO();
                defaultWorkbenchRoleUnit.setRole(Node.MANAGER);
                Long rootTeamUnitId = iTeamService.getRootTeamUnitId(spaceId);
                defaultWorkbenchRoleUnit.setUnitId(rootTeamUnitId);
                controlRoleUnits = CollUtil.newArrayList(defaultWorkbenchRoleUnit);
            }
            else {
                // load parent node role
                controlRoleUnits = iControlRoleService.getControlRolesUnitDtoByControlId(parentNodeId);
            }
        }
        return controlRoleUnits.stream()
                .collect(groupingBy(ControlRoleUnitDTO::getRole, Collectors.mapping(ControlRoleUnitDTO::getUnitId, toSet())));
    }

    @Override
    public void handleNodeRoleUnitsTeamPathName(List<NodeRoleUnit> nodeRoleMemberVos, String spaceId) {
        // get all member's ids
        List<Long> memberIds = nodeRoleMemberVos.stream().map(NodeRoleUnit::getUnitId).collect(toList());
        // handle member's team name. get full hierarchy team name
        Map<Long, List<MemberTeamPathInfo>> memberToTeamPathInfoMap = iTeamService.batchGetFullHierarchyTeamNames(memberIds, spaceId);
        for (NodeRoleUnit member : nodeRoleMemberVos) {
            if (memberToTeamPathInfoMap.containsKey(member.getUnitId())) {
                member.setTeamData(memberToTeamPathInfoMap.get(member.getUnitId()));
            }
        }
    }

    private void addExtendNodeRole(Long userId, String spaceId, String nodeId) {
        // add default inherited roles
        Map<String, Set<Long>> roleToUnitIds = getRoleToUnitIds(true, spaceId, nodeId);
        roleToUnitIds.forEach((role, unitIds) -> {
            if (Node.OWNER.equals(role)) {
                return;
            }
            addNodeRole(userId, nodeId, role, CollUtil.newArrayList(unitIds));
        });
    }
}
