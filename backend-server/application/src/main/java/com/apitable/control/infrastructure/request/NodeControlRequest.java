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

package com.apitable.control.infrastructure.request;

import com.apitable.control.infrastructure.ControlRoleDict;
import com.apitable.control.infrastructure.ControlType;
import com.apitable.control.infrastructure.role.ControlRoleManager;
import com.apitable.control.infrastructure.role.DefaultWorkbenchRole;
import com.apitable.control.infrastructure.role.NodeRole;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import com.apitable.control.mapper.ControlRoleMapper;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.workspace.dto.ControlRoleInfo;
import com.apitable.workspace.dto.SimpleNodeInfo;
import com.apitable.workspace.service.INodeRoleService;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * node control executor.
 *
 * @author Shawn Deng
 */
public class NodeControlRequest extends AbstractControlRequest {

    private static final Logger logger = LoggerFactory.getLogger(NodeControlRequest.class);

    private final List<Long> units;

    private final List<String> nodeIds;

    private boolean treeBuilding;

    private boolean shareTreeBuilding;

    private boolean rubbishBuilding;

    private boolean internalBuilding;

    public NodeControlRequest(List<Long> units, List<String> nodeIds) {
        this.units = units;
        this.nodeIds = nodeIds;
    }

    public void setTreeBuilding(boolean treeBuilding) {
        this.treeBuilding = treeBuilding;
    }

    public void setShareTreeBuilding(boolean shareTreeBuilding) {
        this.shareTreeBuilding = shareTreeBuilding;
    }

    public void setRubbishBuilding(boolean rubbishBuilding) {
        this.rubbishBuilding = rubbishBuilding;
    }

    public void setInternalBuilding(boolean internalBuilding) {
        this.internalBuilding = internalBuilding;
    }

    @Override
    public List<Long> getUnits() {
        return this.units;
    }

    @Override
    public List<String> getControlIds() {
        return this.nodeIds;
    }

    @Override
    public ControlType getType() {
        return ControlType.NODE;
    }

    @Override
    public ControlRoleDict execute() {
        // Load the recycle bin node permission set if building recycle list
        if (rubbishBuilding) {
            if (logger.isTraceEnabled()) {
                logger.trace("Load Rubbish Node Permission");
            }
            return getRubbishNodeRoles();
        }
        List<SimpleNodeInfo> nodeList = getSimpleNodeInfos();
        if (nodeList == null || nodeList.isEmpty()) {
            return ControlRoleDict.create();
        }
        // Internal call to load node permission set
        if (internalBuilding) {
            if (logger.isTraceEnabled()) {
                logger.trace("Load Internal Node Permission");
            }
            return this.getInternalNodeRoles(nodeList);
        }
        // Find the upper-level path of the processing node (insert near-far in sequence),
        // and determine the highest authority of the node
        Map<String, Set<String>> parentNodeRoleMap = new LinkedHashMap<>(16);
        // Collect all parent nodes with configuration roles in order to reduce circular query DB
        // Query the roles of all parent nodes at one time,
        // and use the collection traversal method to quickly calculate the permission roles of each node.
        Set<String> roleNodeIds = new HashSet<>();
        // Start collecting the necessary attributes of nodes. There are two main elements for fast computing.
        // 1.What is the permission mode of the node
        // 2.If the node is in inheritance mode, the parent path has to be loaded, and the DB retrieval is also reduced
        for (String controlId : getControlIds()) {
            // Find the node first
            SimpleNodeInfo node = findNode(nodeList, controlId);
            // If the node information does not exist, look for the next one directly.
            // It should exist, unless a deleted node is passed in.
            if (node == null) {
                if (logger.isTraceEnabled()) {
                    logger.trace("Node [{}] is not exist", controlId);
                }
                continue;
            }
            // If the permission of the node is to inherit the parent node,
            // continue to look up to the parent directory.
            // If the specified permission in the upper directory is not configured with itself, access is not allowed.
            if (node.getExtend()) {
                // Continue to look up to the parent directory. If the specified permissions in the parent directory are not configured with themselves, access is not allowed.
                Set<String> orderParentNodeIds = findParentNodeIdFromTop2Bottom(nodeList, node);
                if (logger.isTraceEnabled()) {
                    logger.trace("Parent Node Id [{}]", orderParentNodeIds);
                }
                // Stores the ordered parent nodes of the specified node's superior corresponding to the specified mode.
                // If it is the first-level node, it is an empty set
                parentNodeRoleMap.put(controlId, orderParentNodeIds);
                roleNodeIds.addAll(orderParentNodeIds);
                if (logger.isTraceEnabled()) {
                    logger.trace("find node [{}] has parent node role [{}]", controlId,
                        orderParentNodeIds);
                }
            } else {
                // The current node has set permissions, and directly obtains the permissions of the current node
                roleNodeIds.add(controlId);
            }
        }

        if (roleNodeIds.isEmpty()) {
            // The parent nodes of all nodes have no permissions, or have no role permissions, return to the default permissions
            // This is generally the case in new space
            ControlRoleDict roleDict = ControlRoleDict.create();
            getControlIds().forEach(
                controlId -> roleDict.put(controlId, new DefaultWorkbenchRole()));
            return roleDict;
        }

        // Find the role corresponding to the parent node at one time,
        // and use the algorithm to traverse to calculate the role configuration of each node
        List<ControlRoleInfo> controlRoleInfos =
            SpringContextHolder.getBean(ControlRoleMapper.class)
                .selectControlRoleInfoByControlIds(roleNodeIds);
        // group by node
        Map<String, List<ControlRoleInfo>> nodeRoleMap = controlRoleInfos.stream()
            .collect(Collectors.groupingBy(ControlRoleInfo::getControlId));
        Map<String, Set<String>> nodeRoles = new LinkedHashMap<>(parentNodeRoleMap.size());
        // If the parent from top to bottom does not contain its own permissions, the following can no longer appear
        // The purpose of creating a SET collection to store unauthorized nodes is to avoid repeated comparisons and reduce traversal when a loop node encounters unauthorized access.
        Set<String> accessDeniedNode = new HashSet<>();
        // Calculate the role of each node. For example, a node may have difference roles,
        // and the highest role can be taken according to the priority.
        for (String controlId : getControlIds()) {
            // When building a node tree, the node is already in the filter list, skip it directly
            if (treeBuilding && accessDeniedNode.contains(controlId)) {
                if (logger.isDebugEnabled()) {
                    logger.debug("[{}] don't has role, deny loop", controlId);
                }
                continue;
            }
            // Determine what the permission mode of the current node is
            if (parentNodeRoleMap.containsKey(controlId)) {
                // Find if parent contains itself from top to bottom
                Set<String> parentNodeIds = parentNodeRoleMap.get(controlId);
                if (parentNodeIds.isEmpty()) {
                    if (logger.isDebugEnabled()) {
                        logger.debug("[{}] haven't parent node role, set default role", controlId);
                    }
                    // The parent node of the node does not have permissions enabled, set the default role
                    nodeRoles.put(controlId, Collections.singleton(Node.MANAGER));
                    continue;
                }
                // Parent nodes should be in order, from top to bottom, otherwise unimaginable data will definitely be generated
                int i = 0;
                for (String parentNodeId : parentNodeIds) {
                    // If the parent node is unprivileged, all nodes below should also not be accessible
                    if (treeBuilding) {
                        if (accessDeniedNode.contains(parentNodeId)) {
                            if (logger.isDebugEnabled()) {
                                logger.debug("[{}] don't has role, deny loop", parentNodeId);
                            }
                            continue;
                        }
                    }
                    // Categorize the roles the user has on the node, there may be multiple roles
                    Set<String> roles = calNodeRoles(nodeRoleMap, parentNodeId, getUnits());
                    if (roles.isEmpty()) {
                        // Found that the role configuration of a parent does not grant permission, which means that there is no permission,
                        // and directly filter out the following nodes
                        if (treeBuilding) {
                            List<String> children = findAllChildren(nodeList, parentNodeId);
                            accessDeniedNode.addAll(children);
                            break;
                        }
                    } else {
                        if (i == parentNodeIds.size() - 1) {
                            // Find the closest parent node
                            nodeRoles.put(controlId, roles);
                        }
                    }
                    i++;
                }
            } else {
                // If the node has set permissions, get the node permissions directly
                Set<String> roles = calNodeRoles(nodeRoleMap, controlId, getUnits());
                if (!roles.isEmpty()) {
                    nodeRoles.put(controlId, roles);
                } else if (treeBuilding) {
                    // When building node tree, directly filter out the following nodes
                    accessDeniedNode.add(controlId);
                    List<String> children = findAllChildren(nodeList, controlId);
                    accessDeniedNode.addAll(children);
                }
            }
        }
        ControlRoleDict roleDict = ControlRoleDict.create();
        // Get the most privileged role
        nodeRoles.forEach((nodeId, roleCodes) -> roleDict.put(nodeId,
            ControlRoleManager.getTopNodeRole(roleCodes)));
        return roleDict;
    }

    private ControlRoleDict getRubbishNodeRoles() {
        ControlRoleDict roleDict = ControlRoleDict.create();
        // Query the permissions view of a node
        List<ControlRoleInfo> controlRoleInfos =
            SpringContextHolder.getBean(ControlRoleMapper.class)
                .selectControlRoleInfoByControlIds(nodeIds);
        if (controlRoleInfos.isEmpty()) {
            // All nodes have no permissions. The node was previously inherited from the root node and returns to the default permissions.
            nodeIds.forEach(controlId -> roleDict.put(controlId, new DefaultWorkbenchRole()));
            return roleDict;
        }
        // Get the node that has enabled permissions
        Set<String> enabledPermissionNodeIds =
            controlRoleInfos.stream().map(ControlRoleInfo::getControlId)
                .collect(Collectors.toSet());
        // Nodes without permissions, return to default permissions
        nodeIds.stream().filter(nodeId -> !enabledPermissionNodeIds.contains(nodeId))
            .forEach(controlId -> roleDict.put(controlId, new DefaultWorkbenchRole()));
        // Filter organizational units and get role sets by node grouping
        Map<String, Set<String>> nodeRoles = controlRoleInfos.stream()
            .filter(permission -> units.contains(permission.getUnitId()))
            .collect(Collectors.groupingBy(ControlRoleInfo::getControlId,
                Collectors.mapping(ControlRoleInfo::getRole, Collectors.toSet())));
        if (nodeRoles.isEmpty()) {
            return roleDict;
        }
        // Get the most privileged role
        nodeRoles.forEach((nodeId, roleCodes) -> roleDict.put(nodeId,
            ControlRoleManager.getTopNodeRole(roleCodes)));
        return roleDict;
    }

    /**
     * For internal call，Need to determine whether the node belongs to the ghost node.
     *
     * @param nodeList simple node list
     */
    private ControlRoleDict getInternalNodeRoles(List<SimpleNodeInfo> nodeList) {
        ControlRoleDict roleDict = ControlRoleDict.create();
        Map<String, SimpleNodeInfo> nodeToInfoMap =
            nodeList.stream().collect(Collectors.toMap(SimpleNodeInfo::getNodeId, v -> v));

        Map<String, List<String>> reverseParentNodeRoleMap = new LinkedHashMap<>(16);
        Set<String> roleNodeIds = new HashSet<>();
        for (String controlId : getControlIds()) {
            if (!nodeToInfoMap.containsKey(controlId)) {
                continue;
            }
            SimpleNodeInfo node = nodeToInfoMap.get(controlId);
            // // If the node has set permissions, get the permissions of node directly
            if (!node.getExtend()) {
                roleNodeIds.add(controlId);
            }
            // Find all parent nodes from bottom to top
            List<String> reverseParentNodeIds = findParentNodeIdFromBottom2Top(nodeList, node);
            reverseParentNodeRoleMap.put(controlId, reverseParentNodeIds);
            if (reverseParentNodeIds.isEmpty()) {
                continue;
            }
            roleNodeIds.addAll(reverseParentNodeIds);
        }
        // The parent nodes of all nodes have no permissions, and the current node has no permissions, returning to the default permissions
        if (roleNodeIds.isEmpty()) {
            getControlIds().forEach(
                controlId -> roleDict.put(controlId, new DefaultWorkbenchRole()));
            return roleDict;
        }

        // Find the role corresponding to the parent node at one time, and use the algorithm to traverse to calculate the role configuration of each node
        List<ControlRoleInfo> controlRoleInfos =
            SpringContextHolder.getBean(ControlRoleMapper.class)
                .selectControlRoleInfoByControlIds(roleNodeIds);
        // Group by node
        Map<String, List<ControlRoleInfo>> nodeRoleMap = controlRoleInfos.stream()
            .collect(Collectors.groupingBy(ControlRoleInfo::getControlId));

        for (String controlId : getControlIds()) {
            if (!nodeToInfoMap.containsKey(controlId)) {
                continue;
            }
            SimpleNodeInfo node = nodeToInfoMap.get(controlId);
            String nodeId = controlId;
            List<String> reverseParentNodeIds = reverseParentNodeRoleMap.get(controlId);
            if (node.getExtend()) {
                if (reverseParentNodeIds.isEmpty()) {
                    // Set default roles
                    roleDict.put(controlId, new DefaultWorkbenchRole());
                    continue;
                }
                nodeId = reverseParentNodeIds.remove(0);
            }
            // Compute node role
            Set<String> roles = calNodeRoles(nodeRoleMap, nodeId, getUnits());
            if (!roles.isEmpty()) {
                // Get the most privileged role
                roleDict.put(controlId, ControlRoleManager.getTopNodeRole(roles));
            } else {
                // No permission, not a ghost node
                continue;
            }
            // No upper-level nodes have designated permissions and should not be ghost nodes
            if (reverseParentNodeIds.isEmpty()) {
                continue;
            }
            // Query from bottom to top whether there is a superior node without permission, it should be a ghost node
            boolean isGhostNode = false;
            for (String parentNodeId : reverseParentNodeIds) {
                Set<String> parentRoles = calNodeRoles(nodeRoleMap, parentNodeId, getUnits());
                if (parentRoles.isEmpty()) {
                    isGhostNode = true;
                    break;
                }
            }
            NodeRole controlRole = (NodeRole) roleDict.get(controlId);
            controlRole.setGhostNode(isGhostNode);
        }
        return roleDict;
    }

    private List<SimpleNodeInfo> getSimpleNodeInfos() {
        // Query the parent node corresponding to the node.
        // In order to improve performance,
        // query all parent nodes at one time to obtain all the superiors of the current node.
        INodeRoleService nodeRoleService = SpringContextHolder.getBean(INodeRoleService.class);
        List<SimpleNodeInfo> nodeList = nodeRoleService.getNodeInfoWithPermissionStatus(nodeIds);
        // is not generating a share tree, or the share node is at the first level
        if (!shareTreeBuilding || nodeList.size() == getControlIds().size()) {
            return nodeList;
        }
        // The shared tree allows the ghost nodes of the fault to retain permissions,
        // so it cannot be calculated from the top down, but calculated from the shared node down to avoid being directly truncated
        // The share node is at the root
        SimpleNodeInfo node = findNode(nodeList, getControlIds().get(0));
        if (node == null) {
            return null;
        }
        // The share node does not have permission
        if (node.getExtend()) {
            // Find the closest parent node of the specified permission and truncate the previous parent node
            List<String> reverseParentNodeIds = findParentNodeIdFromBottom2Top(nodeList, node);
            if (reverseParentNodeIds.isEmpty()) {
                return nodeList;
            }
            int i = 0;
            for (SimpleNodeInfo simpleNodeInfo : nodeList) {
                if (simpleNodeInfo.getNodeId().equals(reverseParentNodeIds.get(0))) {
                    break;
                }
                i++;
            }
            return nodeList.subList(i, nodeList.size());
        } else {
            // The shared node has set permissions, truncating all upper-level nodes
            return nodeList.subList(nodeList.size() - getControlIds().size(), nodeList.size());
        }
    }

    /**
     * find node.
     *
     * @param simpleNodeInfos node list
     * @param nodeId          node id
     * @return node info
     */
    private static SimpleNodeInfo findNode(List<SimpleNodeInfo> simpleNodeInfos, String nodeId) {
        SimpleNodeInfo node = null;
        for (SimpleNodeInfo simpleNodeInfo : simpleNodeInfos) {
            if (simpleNodeInfo.getNodeId().equals(nodeId)) {
                node = simpleNodeInfo;
                break;
            }
        }
        return node;
    }

    /**
     * Recursively get the list of parent nodes of a node.
     *
     * @param simpleNodeInfos node list
     * @param node            node
     * @return set of parent nodes from bottom to top
     */
    private static Set<String> findParentNodeIdFromTop2Bottom(List<SimpleNodeInfo> simpleNodeInfos,
                                                              SimpleNodeInfo node) {
        // Find parent node from bottom to top
        List<String> parentNodeIds = findParentNodeIdFromBottom2Top(simpleNodeInfos, node);
        // Reverse the order, because the acquisition is from bottom to top, for permission control, the order must be reversed, from top to bottom
        Collections.reverse(parentNodeIds);
        return new LinkedHashSet<>(parentNodeIds);
    }

    /**
     * Query the parent node in reverse order.
     *
     * @param simpleNodeInfos node info list
     * @param node            node
     * @return list of node id
     */
    private static List<String> findParentNodeIdFromBottom2Top(List<SimpleNodeInfo> simpleNodeInfos,
                                                               SimpleNodeInfo node) {
        // Find parent nodes in reverse order, from bottom to top
        List<String> parents = new ArrayList<>();
        // Find all parent nodes with permissions configured, from bottom to top
        findParentNodeRole(simpleNodeInfos, node, parents::add);
        return parents;
    }

    /**
     * Find the parent node that enables the role permission configuration.
     *
     * @param simpleNodeInfos node list
     * @param roleInfo        node info
     * @param parents         parent node with permission
     */
    private static void findParentNodeRole(List<SimpleNodeInfo> simpleNodeInfos,
                                           SimpleNodeInfo roleInfo, Consumer<String> parents) {
        for (SimpleNodeInfo simpleNodeInfo : simpleNodeInfos) {
            if (roleInfo.getParentId().equals(simpleNodeInfo.getNodeId())) {
                if (!simpleNodeInfo.getExtend()) {
                    parents.accept(simpleNodeInfo.getNodeId());
                }
                findParentNodeRole(simpleNodeInfos, simpleNodeInfo, parents);
            }
        }
    }

    /**
     * compute node role.
     *
     * @param nodeRoleMap   Node role key-value pair
     * @param nodeId        node id
     * @param memberUnitIds List of organizational units to which members belong
     * @return node role
     */
    private static Set<String> calNodeRoles(Map<String, List<ControlRoleInfo>> nodeRoleMap,
                                            String nodeId, List<Long> memberUnitIds) {
        List<ControlRoleInfo> permissions = nodeRoleMap.get(nodeId);
        if (permissions == null) {
            return new HashSet<>();
        }
        // The organizational unit corresponding to the node role
        Map<String, List<Long>> roleUnitMap = permissions.stream()
            .collect(Collectors.groupingBy(ControlRoleInfo::getRole,
                Collectors.mapping(ControlRoleInfo::getUnitId, Collectors.toList())));
        return roleUnitMap.entrySet()
            .stream()
            .filter(entry -> memberUnitIds.stream().anyMatch(m -> entry.getValue().contains(m)))
            .map(Map.Entry::getKey).collect(Collectors.toSet());
    }

    /**
     * find all child nodes.
     *
     * @param simpleNodeInfos list of node info
     * @param parentNodeId    parent node id
     * @return all child node
     */
    private static List<String> findAllChildren(List<SimpleNodeInfo> simpleNodeInfos,
                                                String parentNodeId) {
        List<String> allChildren = new ArrayList<>();
        List<String> children = findChildren(simpleNodeInfos, parentNodeId);
        if (!children.isEmpty()) {
            allChildren.addAll(children);
            for (String child : children) {
                List<String> subs = findAllChildren(simpleNodeInfos, child);
                allChildren.addAll(subs);
            }
        }
        return allChildren;
    }

    /**
     * Find child node id.
     *
     * @param simpleNodeInfos list of node info
     * @param parentNodeId    parent node id
     * @return list of child node id
     */
    private static List<String> findChildren(List<SimpleNodeInfo> simpleNodeInfos,
                                             String parentNodeId) {
        List<String> children = new ArrayList<>();
        for (SimpleNodeInfo nodeInfo : simpleNodeInfos) {
            if (nodeInfo.getParentId().equals(parentNodeId)) {
                children.add(nodeInfo.getNodeId());
            }
        }
        return children;
    }
}
