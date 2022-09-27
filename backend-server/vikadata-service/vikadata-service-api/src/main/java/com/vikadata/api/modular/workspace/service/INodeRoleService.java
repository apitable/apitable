package com.vikadata.api.modular.workspace.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.vikadata.api.model.vo.node.NodeRoleMemberVo;
import com.vikadata.api.model.vo.node.NodeRoleUnit;
import com.vikadata.api.model.vo.organization.UnitMemberVo;
import com.vikadata.api.modular.workspace.model.ControlRoleInfo;

/**
 * <p>
 * 工作台-节点-角色表 服务类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-18
 */
public interface INodeRoleService {

    /**
     * 开启节点指定权限，并设置组织单元角色
     *
     * includeExtend 开启字段权限后，是否继承默认角色组织单元列表。
     * 默认角色组织单元列表：父级节点，或根部门的角色组织单元。
     *
     * @param userId        用户ID
     * @param spaceId       空间ID
     * @param nodeId        节点ID
     * @param includeExtend 是否继承默认角色组织单元列表
     * @author Chambers
     * @date 2021/5/22
     */
    void enableNodeRole(Long userId, String spaceId, String nodeId, boolean includeExtend);

    /**
     * 关闭节点指定权限
     *
     * @param userId    用户ID
     * @param memberId  成员ID
     * @param nodeId    节点ID
     * @author Chambers
     * @date 2021/5/24
     */
    void disableNodeRole(Long userId, Long memberId, String nodeId);

    /**
     * 为节点添加组织单元指定角色
     *
     * @param userId  用户ID
     * @param nodeId  节点ID
     * @param role    角色
     * @param unitIds 组织单元ID列表
     * @author Shawn Deng
     * @date 2020/7/16 11:53
     */
    void addNodeRole(Long userId, String nodeId, String role, List<Long> unitIds);

    /**
     * 修改组织单元在指定节点的角色
     *
     * @param userId 用户ID
     * @param nodeId 节点ID
     * @param role   角色
     * @param unitIds 组织单元ID
     * @author Shawn Deng
     * @date 2020/7/16 14:15
     */
    void updateNodeRole(Long userId, String nodeId, String role, List<Long> unitIds);

    /**
     * 删除在指定节点的组织单元
     *
     * @param userId 用户ID
     * @param nodeId 节点ID
     * @param unitId 组织单元ID
     * @author Shawn Deng
     * @date 2020/7/16 14:42
     */
    void deleteNodeRole(Long userId, String nodeId, Long unitId);

    /**
     * 删除在指定节点的组织单元
     *
     * @param nodeId 节点ID
     * @param unitIds 组织单元ID集
     * @return 删除的节点控制单元信息
     */
    List<ControlRoleInfo> deleteNodeRoles(String nodeId, List<Long> unitIds);

    /**
     * query node's owner
     *
     * @param nodeId node's id
     * @return NodeAdminVo
     */
    UnitMemberVo getNodeOwner(String nodeId);

    /**
     * handle node member's team name
     *
     * @param unitMemberVos unit member view
     * @param spaceId space's id
     */
    void handleNodeMemberTeamName(List<UnitMemberVo> unitMemberVos, String spaceId);

    /**
     * 获取根部门并构造节点角色视图
     * @param spaceId 空间ID
     * @return NodeRoleUnit
     * @author Shawn Deng
     * @date 2021/6/8 20:33
     */
    NodeRoleUnit getRootNodeRoleUnit(String spaceId);

    /**
     * 查询节点指定角色列表
     *
     * @param nodeId 节点ID
     * @return NodeRoleUnit 列表
     * @author Shawn Deng
     * @date 2020/7/16 11:02
     */
    List<NodeRoleUnit> getNodeRoleUnitList(String nodeId);

    /**
     * 构造空间站内所有的成员视图
     * @param spaceId 空间ID
     * @return NodeRoleMemberVo
     * @author Shawn Deng
     * @date 2021/6/8 20:33
     */
    List<NodeRoleMemberVo> getNodeRoleMembers(String spaceId);

    /**
     * 获取节点所有角色的成员
     *
     * @param spaceId 空间ID
     * @param nodeId  节点ID
     * @return 成员列表
     * @author Shawn Deng
     * @date 2020/7/16 18:26
     */
    List<NodeRoleMemberVo> getNodeRoleMembers(String spaceId, String nodeId);

    /**
     * 获取最近指定权限的节点
     *
     * @param nodeId 节点ID
     * @return nodeId
     * @author Chambers
     * @date 2021/4/17
     */
    String getClosestEnabledRoleNode(String nodeId);

    /**
     * 获取节点的继承ID
     *
     * @param nodeId 节点ID
     * @return 继承节点ID
     * @author Shawn Deng
     * @date 2020/5/14 19:33
     */
    String getNodeExtendNodeId(String nodeId);

    /**
     * 获取节点权限模式是否为指定模式
     *
     * @param nodeId 节点ID
     * @return true | false
     * @author Shawn Deng
     * @date 2020/5/7 19:32
     */
    boolean getNodeRoleIfEnabled(String nodeId);

    /**
     * 删除节点的所有角色
     *
     * @param nodeIds 节点ID集合
     * @author Shawn Deng
     * @date 2020/3/11 15:35
     */
    void deleteByNodeId(Long userId, List<String> nodeIds);

    /**
     * 复制继承节点的非负责人角色
     *
     * @param userId   用户ID
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @param nodeIds  节点ID
     * @author Chambers
     * @date 2020/8/4
     */
    void copyExtendNodeRoleIfExtend(Long userId, String spaceId, Long memberId, Collection<String> nodeIds);

    /**
     * 获取节点的角色控制下各角色的unitIds。
     *
     * isParent 是否只获取nodeId父节点的角色控制下各角色的unitIds。
     * 如果nodeId没有父节点开启角色控制，则返回默认控制台的控制角色。
     * @param isParent 是否获取nodeId父节点的角色控制下各角色的unitIds。
     * @param spaceId 空间id
     * @param nodeId 节点id
     * @return roleToUnitIds
     */
    Map<String, Set<Long>> getRoleToUnitIds(boolean isParent, String spaceId, String nodeId);

    /**
     * handle node role member's team path name, show full hierarchy team name
     *
     * @param nodeRoleUnits node role units
     * @param spaceId space's id
     */
    void handleNodeRoleUnitsTeamPathName(List<NodeRoleUnit> nodeRoleUnits, String spaceId);

}