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

package com.apitable.workspace.service;

import com.apitable.organization.vo.UnitMemberVo;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.workspace.dto.ControlRoleInfo;
import com.apitable.workspace.dto.SimpleNodeInfo;
import com.apitable.workspace.vo.NodeRoleMemberVo;
import com.apitable.workspace.vo.NodeRoleUnit;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * node role service.
 */
public interface INodeRoleService {

    /**
     * Enable node to specify permissions and set organizational unit roles.
     * </p>
     * includeExtend Whether to inherit the default role organization unit list after field permissions are enabled.
     * Default role organization unit list: the parent node or the role organization unit of the root department.
     *
     * @param userId        user id
     * @param spaceId       space id
     * @param nodeId        node id
     * @param includeExtend Whether to inherit the list of default role organization units
     */
    void enableNodeRole(Long userId, String spaceId, String nodeId, boolean includeExtend);

    /**
     * close the node to specify permissions.
     *
     * @param userId user id
     * @param nodeId node id
     */
    void disableNodeRole(Long userId, String nodeId);

    /**
     * Add an organizational unit to a node to specify a role.
     *
     * @param userId  user id
     * @param nodeId  node id
     * @param role    role
     * @param unitIds unitIds
     */
    void addNodeRole(Long userId, String nodeId, String role, List<Long> unitIds);

    /**
     * Modify the role of the organizational unit on the specified node.
     *
     * @param userId  user id
     * @param nodeId  node id
     * @param role    role
     * @param unitIds unitIds
     */
    void updateNodeRole(Long userId, String nodeId, String role, List<Long> unitIds);

    /**
     * Delete the organizational unit on the specified node.
     *
     * @param userId user id
     * @param nodeId node id
     * @param unitId unitId
     */
    void deleteNodeRole(Long userId, String nodeId, Long unitId);

    /**
     * delete role.
     *
     * @param nodeId  node id
     * @param unitIds unitIds
     * @return deleted node control unit information
     */
    List<ControlRoleInfo> deleteNodeRoles(String nodeId, List<Long> unitIds);

    /**
     * query node's owner.
     *
     * @param nodeId node id
     * @return NodeAdminVo
     */
    UnitMemberVo getNodeOwner(String nodeId);

    /**
     * handle node member's team name.
     *
     * @param unitMemberVos unit member view
     * @param spaceId       space id
     */
    void handleNodeMemberTeamName(List<UnitMemberVo> unitMemberVos, String spaceId);

    /**
     * Get the root department and construct the node role view.
     *
     * @param spaceId space id
     * @return NodeRoleUnit
     */
    NodeRoleUnit getRootNodeRoleUnit(String spaceId);

    /**
     * query the list of roles specified by the node.
     *
     * @param nodeId node id
     * @return NodeRoleUnits
     */
    List<NodeRoleUnit> getNodeRoleUnitList(String nodeId);

    /**
     * construct all member views in the space.
     *
     * @param spaceId space id
     * @return NodeRoleMemberVo
     */
    List<NodeRoleMemberVo> getNodeRoleMembers(String spaceId);

    /**
     * gets members of all roles of the node.
     *
     * @param spaceId space id
     * @param nodeId  node id
     * @return NodeRoleMemberVo
     */
    List<NodeRoleMemberVo> getNodeRoleMembers(String spaceId, String nodeId);

    /**
     * GetNodeRoleMembersPage.
     *
     * @param page    page param
     * @param spaceId space id
     * @return NodeRoleMemberVo page
     * @author Chambers
     */
    IPage<NodeRoleMemberVo> getNodeRoleMembersPage(Page<NodeRoleMemberVo> page, String spaceId);

    /**
     * GetNodeRoleMembersPageInfo.
     *
     * @param page   page param
     * @param nodeId node id
     * @return NodeRoleMemberVo PageInfo
     * @author Chambers
     */
    PageInfo<NodeRoleMemberVo> getNodeRoleMembersPageInfo(Page<NodeRoleMemberVo> page,
                                                          String nodeId);

    /**
     * Gets the node with the most recently specified permission.
     *
     * @param nodeId node id
     * @return nodeId
     */
    String getClosestEnabledRoleNode(String nodeId);

    /**
     * gets the inheritance id of the node.
     *
     * @param nodeId node id
     * @return node id
     */
    String getNodeExtendNodeId(String nodeId);

    /**
     * Gets whether the node permission mode is the specified mode.
     *
     * @param nodeId node id
     * @return true | false
     */
    boolean getNodeRoleIfEnabled(String nodeId);

    /**
     * delete all roles of the node.
     *
     * @param nodeIds nodeIds
     */
    void deleteByNodeId(Long userId, List<String> nodeIds);

    /**
     * copy the non owner role of the inherited node.
     *
     * @param userId   user id
     * @param spaceId  space id
     * @param memberId member id
     * @param nodeIds  nodeIds
     */
    void copyExtendNodeRoleIfExtend(Long userId, String spaceId, Long memberId,
                                    Collection<String> nodeIds);

    /**
     * Gets the unit Ids of each role under the control of the role of the node.
     * </p>
     * isParent: Whether to obtain only the unit Ids of each role under the control of the role of the node id parent node.
     * If the node id does not have a parent node to enable role control, the default console control role is returned.
     *
     * @param isParent Whether to obtain the unit ids of each role under the control of the role of the node id parent node.
     * @param spaceId  space id
     * @param nodeId   node id
     * @return roleToUnitIds
     */
    Map<String, Set<Long>> getRoleToUnitIds(boolean isParent, String spaceId, String nodeId);

    /**
     * Get node information with permission status.
     *
     * @param nodeIds node ids
     * @return List of SimpleNodeInfo
     * @author Chambers
     */
    List<SimpleNodeInfo> getNodeInfoWithPermissionStatus(List<String> nodeIds);

    /**
     * Get minimum required roles based on node permissions.
     *
     * @param nodePermissions the node permissions
     * @return the required roles
     */
    List<String> getMinimumRequiredRole(List<Integer> nodePermissions);
}