package com.vikadata.api.modular.workspace.service.impl;

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

import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.constants.AuditConstants;
import com.vikadata.api.control.ControlType;
import com.vikadata.api.control.role.ControlRole;
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.DefaultWorkbenchRole;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.enums.audit.AuditSpaceAction;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.enums.organization.UnitType;
import com.vikadata.api.event.AuditSpaceEvent;
import com.vikadata.api.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.model.vo.node.NodeRoleMemberVo;
import com.vikadata.api.model.vo.node.NodeRoleUnit;
import com.vikadata.api.model.vo.organization.RoleInfoVo;
import com.vikadata.api.model.vo.organization.UnitMemberVo;
import com.vikadata.api.model.vo.organization.UnitTeamVo;
import com.vikadata.api.modular.control.service.IControlRoleService;
import com.vikadata.api.modular.control.service.IControlService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.mapper.UnitMapper;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.organization.service.IOrganizationService;
import com.vikadata.api.modular.organization.service.IRoleMemberService;
import com.vikadata.api.modular.organization.service.IRoleService;
import com.vikadata.api.modular.organization.service.ITeamService;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.space.service.ISpaceRoleService;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.model.ControlRoleInfo;
import com.vikadata.api.modular.workspace.model.ControlRoleUnitDTO;
import com.vikadata.api.modular.workspace.model.SimpleNodeInfo;
import com.vikadata.api.modular.workspace.service.INodeRoleService;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.ControlRoleEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

/**
 * <p>
 * 工作台-节点-角色表 服务实现类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-18
 */
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
    private UserSpaceService userSpaceService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private IRoleMemberService iRoleMemberService;

    @Resource
    private IRoleService iRoleService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enableNodeRole(Long userId, String spaceId, String nodeId, boolean includeExtend) {
        Long memberId = userSpaceService.getMemberId(userId, spaceId);
        // 开启节点指定权限，将当前成员组织单元角色设置为 Owner
        Long unitId = iUnitService.getUnitIdByRefId(memberId);
        log.info("「{}」开启节点「{}」指定权限，并设置组织单元「{}」角色为「{}」", userId, nodeId, unitId, Node.OWNER);
        // 创建权限控制单元
        iControlService.create(userId, spaceId, nodeId, ControlType.NODE);
        // 创建控制单元角色
        iControlRoleService.addControlRole(userId, nodeId, Collections.singletonList(unitId), Node.OWNER);
        if (includeExtend) {
            addExtendNodeRole(userId, spaceId, nodeId);
        }
    }

    @Override
    public void disableNodeRole(Long userId, Long memberId, String nodeId) {
        log.info("「{}」关闭节点「{}」指定权限", userId, nodeId);
        // 删除权限控制单元
        iControlService.removeControl(userId, Collections.singletonList(nodeId), false);
    }

    @Override
    public void addNodeRole(Long userId, String nodeId, String role, List<Long> unitIds) {
        log.info("「{}」在节点「{}」添加组织单元「{}」的权限角色为「{}」", userId, nodeId, unitIds, role);
        // 不能指定修改为节点拥有者
        ExceptionUtil.isFalse(role.equals(Node.OWNER), PermissionException.ADD_NODE_ROLE_ERROR);
        // 过滤组织单元，如果已存在的则修改，未存在的则添加
        List<ControlRoleEntity> controlRoles = iControlRoleService.getByControlId(nodeId);
        // 无已存在的组织单元，全部新增
        if (CollUtil.isEmpty(controlRoles)) {
            iControlRoleService.addControlRole(userId, nodeId, unitIds, role);
            return;
        }
        Map<Long, ControlRoleEntity> unitRoleMap = controlRoles.stream().filter(i -> !i.getRoleCode().equals(Node.OWNER)).collect(Collectors.toMap(ControlRoleEntity::getUnitId, i -> i));

        List<Long> addUnitIds = new ArrayList<>();
        List<Long> updateIds = new ArrayList<>();
        for (Long unitId : unitIds) {
            if (!unitRoleMap.containsKey(unitId)) {
                // 不存在，新增此组织单元的角色
                addUnitIds.add(unitId);
            }
            else if (!unitRoleMap.get(unitId).getRoleCode().equals(role)) {
                // 存在且角色不一样，修改此组织单元的角色
                updateIds.add(unitRoleMap.get(unitId).getId());
            }
        }
        if (CollUtil.isNotEmpty(addUnitIds)) {
            iControlRoleService.addControlRole(userId, nodeId, addUnitIds, role);
        }
        if (CollUtil.isNotEmpty(updateIds)) {
            // 指定表ID 修改，避免修改了文件管理员
            iControlRoleService.editControlRole(userId, updateIds, role);
        }
    }

    @Override
    public void updateNodeRole(Long userId, String nodeId, String role, List<Long> unitIds) {
        log.info("「{}」在节点「{}」修改组织单元「{}」的权限角色为「{}」", userId, nodeId, unitIds, role);
        // 不能指定修改为节点拥有者
        ExceptionUtil.isFalse(role.equals(Node.OWNER), PermissionException.UPDATE_NODE_ROLE_ERROR);
        iControlRoleService.editControlRole(userId, nodeId, unitIds, role);
        Map<Long, String> unitIdToRoleCode = iControlRoleService.getUnitIdToRoleCodeMapWithoutOwnerRole(nodeId, unitIds);
        List<String> oldRoles = new ArrayList<>(unitIds.size());
        unitIds.forEach(unitId -> oldRoles.add(unitIdToRoleCode.getOrDefault(unitId, StrUtil.EMPTY)));
        // 发布空间审计事件
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.UNIT_IDS, unitIds);
        info.set(AuditConstants.OLD_ROLE, oldRoles);
        info.set(AuditConstants.ROLE, role);
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.UPDATE_NODE_ROLE).userId(userId).nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    @Override
    public void deleteNodeRole(Long userId, String nodeId, Long unitId) {
        log.info("删除节点「{}」组织单元「{}」的权限角色", nodeId, unitId);
        // 获取组织单元原来的角色信息
        List<ControlRoleEntity> controlRoles = iControlRoleService.getByControlIdAndUnitId(nodeId, unitId);
        ExceptionUtil.isNotEmpty(controlRoles, PermissionException.DELETE_NODE_ROLE_ERROR);
        // 过滤节点拥有者
        List<Long> ids = controlRoles.stream().filter(controlRole -> !controlRole.getRoleCode().equals(Node.OWNER)).map(ControlRoleEntity::getId).collect(Collectors.toList());
        if (CollUtil.isEmpty(ids)) {
            return;
        }
        // 指定表ID 删除，避免删除了文件管理员
        iControlRoleService.removeByIds(ids);
        // 发布空间审计事件
        JSONObject info = JSONUtil.createObj();
        info.set(AuditConstants.UNIT_ID, unitId);
        info.set(AuditConstants.OLD_ROLE, controlRoles.stream().filter(controlRole -> !controlRole.getRoleCode().equals(Node.OWNER))
                .findFirst().map(ControlRoleEntity::getRoleCode).orElse(StrUtil.EMPTY));
        AuditSpaceArg arg = AuditSpaceArg.builder().action(AuditSpaceAction.DELETE_NODE_ROLE).userId(userId).nodeId(nodeId).info(info).build();
        SpringContextHolder.getApplicationContext().publishEvent(new AuditSpaceEvent(this, arg));
    }

    @Override
    public List<ControlRoleInfo> deleteNodeRoles(String nodeId, List<Long> unitIds) {
        log.info("删除节点「{}」组织单元「{}」的权限角色", nodeId, unitIds);
        // 获取组织单元原来的角色信息
        List<ControlRoleInfo> exitControlRole = iControlRoleService.getUnitRoleByControlIdAndUnitIds(nodeId, unitIds);
        // 过滤节点拥有者
        List<ControlRoleInfo> controlRoles = exitControlRole.stream().filter(controlRole -> !controlRole.getRole().equals(Node.OWNER)).collect(toList());
        List<Long> exitUnitIds = controlRoles.stream().map(ControlRoleInfo::getUnitId).collect(toList());
        iControlRoleService.removeByControlIdAndUnitIds(nodeId, exitUnitIds);
        return controlRoles;
    }

    /**
     * 获取节点的负责人
     *
     * @param nodeId 节点ID
     * @return 负责人组织单元ID
     */
    private Long getNodeOwnerId(String nodeId) {
        Long ownerUnitId = iControlRoleService.getUnitIdByControlIdAndRoleCode(nodeId, Node.OWNER);
        return ownerUnitId != null ? unitMapper.selectRefIdById(ownerUnitId) : null;
    }

    @Override
    public UnitMemberVo getNodeOwner(String nodeId) {
        log.info("查询节点的负责人");
        Long ownerId = getNodeOwnerId(nodeId);
        if (ownerId != null) {
            List<UnitMemberVo> unitMemberVos = iOrganizationService.findUnitMemberVo(Collections.singletonList(ownerId));
            return CollUtil.isNotEmpty(unitMemberVos) ? CollUtil.getFirst(unitMemberVos) : null;
        }
        return null;
    }

    @Override
    public void deleteByNodeId(Long userId, List<String> nodeIds) {
        log.info("删除节点所有角色");
        List<String> existedControlIds = iControlService.getExistedControlId(nodeIds);
        if (existedControlIds.isEmpty()) {
            return;
        }
        iControlService.removeControl(userId, nodeIds, false);
    }

    @Override
    public String getClosestEnabledRoleNode(String nodeId) {
        log.info("获取节点");
        boolean assignMode = this.getNodeRoleIfEnabled(nodeId);
        // 节点非继承模式，直接返回
        if (assignMode) {
            return nodeId;
        }
        // 获取节点所继承的节点ID
        return getNodeExtendNodeId(nodeId);
    }

    @Override
    public String getNodeExtendNodeId(String nodeId) {
        log.info("获取节点所继承的节点ID");
        // 查询节点对应的父级节点ID,为了提高性能，一次性查询所有父级节点，得出当前节点的上级树形结构
        List<SimpleNodeInfo> nodeList = nodeMapper.selectAllParentNodeIdsByNodeIds(Collections.singletonList(nodeId), false);
        // 查询父级目录是否存在指定模式
        SimpleNodeInfo node = findNode(nodeList, nodeId);
        SimpleNodeInfo parent = findParentRolesExtend(nodeList, node);
        if (parent == null) {
            // 上级节点都没有继承权限，直接返回null
            return null;
        }
        return parent.getNodeId();
    }

    @Override
    public boolean getNodeRoleIfEnabled(String nodeId) {
        AtomicReference<Boolean> assign = new AtomicReference<>(false);
        iControlService.checkControlStatus(nodeId, assign::set);
        log.info("节点权限是否为指定模式: [{}]", assign.get());
        return assign.get();
    }

    private Map<String, List<ControlRoleUnitDTO>> groupRoleByNodeId(String nodeId) {
        List<ControlRoleUnitDTO> controlRoles = iControlRoleService.getControlRolesUnitDtoByControlId(nodeId);
        // 以角色分组
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
        unit.setUnitName(team.getTeamName());
        unit.setMemberCount(team.getMemberCount());
        return unit;
    }

    @Override
    public List<NodeRoleUnit> getNodeRoleUnitList(String nodeId) {
        log.info("查询指定节点的角色所分配组织单元列表");
        String spaceId = nodeMapper.selectSpaceIdByNodeId(nodeId);
        // 以角色分组
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
                // 保存组织单元和角色信息
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
            // 批量查询补充组织单元信息
            if (!teamIds.isEmpty()) {
                List<UnitTeamVo> teamVos = iOrganizationService.findUnitTeamVo(spaceId, teamIds);
                for (UnitTeamVo team : teamVos) {
                    NodeRoleUnit unit = unitIdToFieldRoleMap.get(team.getUnitId());
                    unit.setUnitName(team.getTeamName());
                    unit.setMemberCount(team.getMemberCount());
                    roleUnits.add(unit);
                }
            }
            if (!memberIds.isEmpty()) {
                List<UnitMemberVo> memberVos = iOrganizationService.findUnitMemberVo(memberIds);
                for (UnitMemberVo member : memberVos) {
                    NodeRoleUnit unit = unitIdToFieldRoleMap.get(member.getUnitId());
                    unit.setUnitName(member.getMemberName());
                    unit.setAvatar(member.getAvatar());
                    unit.setTeams(member.getTeams());
                    roleUnits.add(unit);
                }
            }
            if (!roleIds.isEmpty()) {
                List<RoleInfoVo> roles = iRoleService.getRoleVos(spaceId, roleIds);
                for (RoleInfoVo role: roles) {
                    NodeRoleUnit unit = unitIdToFieldRoleMap.get(role.getUnitId());
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
        log.info("加载空间站所有成员");
        List<Long> memberIds = iMemberService.getMemberIdsBySpaceId(spaceId);
        List<NodeRoleMemberVo> results = memberMapper.selectNodeRoleMemberByIds(memberIds);

        // 赋予权限值
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
        // 管理员
        List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId);
        Long ownerId = this.getNodeOwnerId(nodeId);
        // 按角色分组
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

        // 过滤重复的权限
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

        // 赋予权限值
        results.forEach(result -> {
            result.setRole(memberRoleMap.get(result.getMemberId()));
            result.setIsAdmin(admins.contains(result.getMemberId()));
        });

        return results;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copyExtendNodeRoleIfExtend(Long userId, String spaceId, Long memberId, Collection<String> nodeIds) {
        log.info("复制继承节点的角色");
        Long unitId = unitMapper.selectUnitIdByRefId(memberId);
        for (String nodeId : nodeIds) {
            boolean assignMode = this.getNodeRoleIfEnabled(nodeId);
            // 节点非继承模式，跳过
            if (assignMode) {
                continue;
            }
            // 复制继承节点的非负责人角色
            String extendNodeId = getNodeExtendNodeId(nodeId);
            if (extendNodeId == null) {
                continue;
            }
            List<ControlRoleInfo> controlRoleInfos = iControlRoleService.getUnitRoleByControlId(extendNodeId);
            Map<Long, String> unitRoleMap = new HashMap<>(controlRoleInfos.size() + 1);
            for (ControlRoleInfo controlRoleInfo : controlRoleInfos) {
                // 操作者原来的指定权限、原来的负责人，不保留跳过
                if (controlRoleInfo.getUnitId().equals(unitId) || controlRoleInfo.getRole().equals(Node.OWNER)) {
                    continue;
                }
                unitRoleMap.put(controlRoleInfo.getUnitId(), controlRoleInfo.getRole());
            }
            // 将操作者设置为负责人角色
            unitRoleMap.put(unitId, Node.OWNER);
            // 创建权限控制单元
            iControlService.create(userId, spaceId, nodeId, ControlType.NODE);
            // 创建控制单元角色
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
                // 没有父节点开启了权限，默认工作台角色，加载根部门信息
                ControlRoleUnitDTO defaultWorkbenchRoleUnit = new ControlRoleUnitDTO();
                defaultWorkbenchRoleUnit.setRole(Node.MANAGER);
                Long rootTeamUnitId = iTeamService.getRootTeamUnitId(spaceId);
                defaultWorkbenchRoleUnit.setUnitId(rootTeamUnitId);
                controlRoleUnits = CollUtil.newArrayList(defaultWorkbenchRoleUnit);
            }
            else {
                // 加载父节点角色
                controlRoleUnits = iControlRoleService.getControlRolesUnitDtoByControlId(parentNodeId);
            }
        }
        return controlRoleUnits.stream()
                .collect(groupingBy(ControlRoleUnitDTO::getRole, Collectors.mapping(ControlRoleUnitDTO::getUnitId, toSet())));
    }

    private void addExtendNodeRole(Long userId, String spaceId, String nodeId) {
        // 添加默认继承的角色
        Map<String, Set<Long>> roleToUnitIds = getRoleToUnitIds(true, spaceId, nodeId);
        roleToUnitIds.forEach((role, unitIds) -> {
            if (Node.OWNER.equals(role)) {
                return;
            }
            addNodeRole(userId, nodeId, role, CollUtil.newArrayList(unitIds));
        });
    }

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
}
