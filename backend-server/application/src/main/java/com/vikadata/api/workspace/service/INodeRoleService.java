package com.vikadata.api.workspace.service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.vikadata.api.workspace.vo.NodeRoleMemberVo;
import com.vikadata.api.workspace.vo.NodeRoleUnit;
import com.vikadata.api.organization.vo.UnitMemberVo;
import com.vikadata.api.workspace.dto.ControlRoleInfo;

public interface INodeRoleService {

    /**
     * Enable node to specify permissions and set organizational unit roles
     *
     * includeExtend Whether to inherit the default role organization unit list after field permissions are enabled.
     * Default role organization unit list: the parent node or the role organization unit of the root department.
     *
     * @param userId user id
     * @param spaceId space id
     * @param nodeId node id
     * @param includeExtend Whether to inherit the list of default role organization units
     */
    void enableNodeRole(Long userId, String spaceId, String nodeId, boolean includeExtend);

    /**
     * close the node to specify permissions
     *
     * @param userId user id
     * @param memberId member id
     * @param nodeId node id
     */
    void disableNodeRole(Long userId, Long memberId, String nodeId);

    /**
     * Add an organizational unit to a node to specify a role
     *
     * @param userId user id
     * @param nodeId node id
     * @param role    role
     * @param unitIds unitIds
     */
    void addNodeRole(Long userId, String nodeId, String role, List<Long> unitIds);

    /**
     * Modify the role of the organizational unit on the specified node
     *
     * @param userId user id
     * @param nodeId node id
     * @param role   role
     * @param unitIds unitIds
     */
    void updateNodeRole(Long userId, String nodeId, String role, List<Long> unitIds);

    /**
     * Delete the organizational unit on the specified node
     *
     * @param userId user id
     * @param nodeId node id
     * @param unitId unitId
     */
    void deleteNodeRole(Long userId, String nodeId, Long unitId);

    /**
     * @param nodeId node id
     * @param unitIds unitIds
     * @return deleted node control unit information
     */
    List<ControlRoleInfo> deleteNodeRoles(String nodeId, List<Long> unitIds);

    /**
     * query node's owner
     *
     * @param nodeId node id
     * @return NodeAdminVo
     */
    UnitMemberVo getNodeOwner(String nodeId);

    /**
     * handle node member's team name
     *
     * @param unitMemberVos unit member view
     * @param spaceId space id
     */
    void handleNodeMemberTeamName(List<UnitMemberVo> unitMemberVos, String spaceId);

    /**
     * Get the root department and construct the node role view
     * @param spaceId space id
     * @return NodeRoleUnit
     */
    NodeRoleUnit getRootNodeRoleUnit(String spaceId);

    /**
     * query the list of roles specified by the node
     *
     * @param nodeId node id
     * @return NodeRoleUnits
     */
    List<NodeRoleUnit> getNodeRoleUnitList(String nodeId);

    /**
     * construct all member views in the space
     * @param spaceId space id
     * @return NodeRoleMemberVo
     */
    List<NodeRoleMemberVo> getNodeRoleMembers(String spaceId);

    /**
     * gets members of all roles of the node
     *
     * @param spaceId space id
     * @param nodeId node id
     * @return NodeRoleMemberVo
     */
    List<NodeRoleMemberVo> getNodeRoleMembers(String spaceId, String nodeId);

    /**
     * Gets the node with the most recently specified permission
     *
     * @param nodeId node id
     * @return nodeId
     */
    String getClosestEnabledRoleNode(String nodeId);

    /**
     * gets the inheritance id of the node
     *
     * @param nodeId node id
     * @return node id
     */
    String getNodeExtendNodeId(String nodeId);

    /**
     * Gets whether the node permission mode is the specified mode
     *
     * @param nodeId node id
     * @return true | false
     */
    boolean getNodeRoleIfEnabled(String nodeId);

    /**
     * delete all roles of the node
     *
     * @param nodeIds nodeIds
     */
    void deleteByNodeId(Long userId, List<String> nodeIds);

    /**
     * copy the non owner role of the inherited node
     *
     * @param userId user id
     * @param spaceId space id
     * @param memberId member id
     * @param nodeIds  nodeIds
     */
    void copyExtendNodeRoleIfExtend(Long userId, String spaceId, Long memberId, Collection<String> nodeIds);

    /**
     * Gets the unit Ids of each role under the control of the role of the node.
     *
     * isParent: Whether to obtain only the unit Ids of each role under the control of the role of the node id parent node.
     * If the node id does not have a parent node to enable role control, the default console control role is returned.
     * @param isParent Whether to obtain the unit ids of each role under the control of the role of the node id parent node.
     * @param spaceId space id
     * @param nodeId node id
     * @return roleToUnitIds
     */
    Map<String, Set<Long>> getRoleToUnitIds(boolean isParent, String spaceId, String nodeId);

    /**
     * handle node role member's team path name, show full hierarchy team name
     *
     * @param nodeRoleUnits node role units
     * @param spaceId space id
     */
    void handleNodeRoleUnitsTeamPathName(List<NodeRoleUnit> nodeRoleUnits, String spaceId);

}