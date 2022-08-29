package com.vikadata.api.control.request;

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

import com.vikadata.api.control.ControlRoleDict;
import com.vikadata.api.control.ControlType;
import com.vikadata.api.control.role.NodeRole;
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.DefaultWorkbenchRole;
import com.vikadata.api.control.role.RoleConstants.Node;
import com.vikadata.api.modular.control.mapper.ControlRoleMapper;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.model.ControlRoleInfo;
import com.vikadata.api.modular.workspace.model.SimpleNodeInfo;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;

/**
 * 节点角色计算请求
 * @author Shawn Deng
 * @date 2021-03-17 19:16:56
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
        // 加载回收站节点权限集
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
        // 内部调用加载节点权限集
        if (internalBuilding) {
            if (logger.isTraceEnabled()) {
                logger.trace("Load Internal Node Permission");
            }
            return this.getInternalNodeRoles(nodeList);
        }
        // 查找处理节点的上级路径（近-远依次插入），判断节点的最高权限
        Map<String, Set<String>> parentNodeRoleMap = new LinkedHashMap<>(16);
        // 收集所有存在配置角色的父节点，目的是为了减少循环查询DB
        // 一次性将所有父节点的角色查询出来，利用集合遍历方式极速计算每一个节点的权限角色出来
        Set<String> roleNodeIds = new HashSet<>();
        // 开始采集节点的必要属性，极速计算有两大要素
        // 1.节点的权限模式是什么
        // 2.如果节点是继承模式，那么得将父级路径加载出来，而且还要减少DB检索
        for (String controlId : getControlIds()) {
            // 先找到节点
            SimpleNodeInfo node = findNode(nodeList, controlId);
            // 节点信息不存在，直接找下一个，按道理是应该存在的，除非传入一个已删除的节点ID
            if (node == null) {
                if (logger.isTraceEnabled()) {
                    logger.trace("Node [{}] is not exist", controlId);
                }
                continue;
            }
            // 继承模式，继续往上查找到父级目录，如果上级目录当中指定权限没有配置自己，则不允许访问
            if (node.getExtend()) {
                // 继承模式，继续往上查找到父级目录，如果上级目录当中指定权限没有配置自己，则不允许访问
                Set<String> orderParentNodeIds = findParentNodeIdFromTop2Bottom(nodeList, node);
                if (logger.isTraceEnabled()) {
                    logger.trace("Parent Node Id [{}]", orderParentNodeIds);
                }
                // 存储节点上级对应指定模式的所有父节点,如果是第一层节点，orderParentNodeIds是空集合
                parentNodeRoleMap.put(controlId, orderParentNodeIds);
                roleNodeIds.addAll(orderParentNodeIds);
                if (logger.isTraceEnabled()) {
                    logger.trace("find node [{}] has parent node role [{}]", controlId, orderParentNodeIds);
                }
            }
            else {
                // 当前节点是指定模式，直接获取当前节点的权限
                roleNodeIds.add(controlId);
            }
        }

        if (roleNodeIds.isEmpty()) {
            // 所有的节点所属父节点都没有权限，或者，节点也没有角色权限，返回默认权限
            // 这种情况一般出现在新的工作空间站内，无权限
            ControlRoleDict roleDict = ControlRoleDict.create();
            getControlIds().forEach(controlId -> roleDict.put(controlId, new DefaultWorkbenchRole()));
            return roleDict;
        }

        // 一次性查找父级节点对应的角色，利用算法遍历计算出每个节点的角色配置
        List<ControlRoleInfo> controlRoleInfos = SpringContextHolder.getBean(ControlRoleMapper.class)
            .selectControlRoleInfoByControlIds(roleNodeIds);
        // 将结果做个分组，以节点分组
        Map<String, List<ControlRoleInfo>> nodeRoleMap = controlRoleInfos.stream()
            .collect(Collectors.groupingBy(ControlRoleInfo::getControlId));
        // 再遍历一次，将节点过滤出来
        Map<String, Set<String>> nodeRoles = new LinkedHashMap<>(parentNodeRoleMap.size());
        // 继承模式下，从上往下的父级中如果不包含自己的权限，则下面的都不能再出现
        // 建立set集合存储无权限的节点是为了循环节点遇到无权限的时候，避免重复比较，减少遍历
        Set<String> accessDeniedNode = new HashSet<>();
        // 计算每个节点的角色，比如节点可能拥有多个角色，根据优先级则取最高的角色即可
        for (String controlId : getControlIds()) {
            // 构建树时，节点已在过滤之列，直接跳过
            if (treeBuilding && accessDeniedNode.contains(controlId)) {
                if (logger.isDebugEnabled()) {
                    logger.debug("[{}] don't has role, deny loop", controlId);
                }
                continue;
            }
            // 判断当前节点的权限模式是什么
            if (parentNodeRoleMap.containsKey(controlId)) {
                // 继承模式，从上往下查找父级是否包含自己
                Set<String> parentNodeIds = parentNodeRoleMap.get(controlId);
                if (parentNodeIds.isEmpty()) {
                    if (logger.isDebugEnabled()) {
                        logger.debug("[{}] haven't parent node role, set default role", controlId);
                    }
                    // 节点的父节点都未开启权限,设置默认角色
                    nodeRoles.put(controlId, Collections.singleton(Node.MANAGER));
                    continue;
                }
                // parents应该是有序的，从上往下的顺序，不然绝对产生无法想象的数据
                int i = 0;
                for (String parentNodeId : parentNodeIds) {
                    // 如果父级节点是无权限的，下面的所有节点也不应该可以访问
                    if (treeBuilding) {
                        if (accessDeniedNode.contains(parentNodeId)) {
                            if (logger.isDebugEnabled()) {
                                logger.debug("[{}] don't has role, deny loop", parentNodeId);
                            }
                            continue;
                        }
                    }
                    // 归类自己在节点拥有的角色，可能有多个角色
                    Set<String> roles = calNodeRoles(nodeRoleMap, parentNodeId, getUnits());
                    if (roles.isEmpty()) {
                        // 找到某个父级的角色配置没有配置自己
                        // 因为父级肯定是指定模式，代表自己没有权限，直接把下面的节点也过滤掉
                        if (treeBuilding) {
                            List<String> children = findAllChildren(nodeList, parentNodeId);
                            accessDeniedNode.addAll(children);
                            break;
                        }
                    }
                    else {
                        if (i == parentNodeIds.size() - 1) {
                            // 最靠近的父级节点
                            nodeRoles.put(controlId, roles);
                        }
                    }
                    i++;
                }
            }
            else {
                // 指定模式，直接获取节点权限
                Set<String> roles = calNodeRoles(nodeRoleMap, controlId, getUnits());
                if (!roles.isEmpty()) {
                    nodeRoles.put(controlId, roles);
                }
                else if (treeBuilding) {
                    // 指定模式，自己没有权限，构建树时，直接把下面的节点也过滤掉
                    accessDeniedNode.add(controlId);
                    List<String> children = findAllChildren(nodeList, controlId);
                    accessDeniedNode.addAll(children);
                }
            }
        }
        ControlRoleDict roleDict = ControlRoleDict.create();
        // 取最高角色
        nodeRoles.forEach((nodeId, roleCodes) -> roleDict.put(nodeId, ControlRoleManager.getTopNodeRole(roleCodes)));
        return roleDict;
    }

    public ControlRoleDict getRubbishNodeRoles() {
        ControlRoleDict roleDict = ControlRoleDict.create();
        // 查询节点对应权限视图
        List<ControlRoleInfo> controlRoleInfos = SpringContextHolder.getBean(ControlRoleMapper.class)
            .selectControlRoleInfoByControlIds(nodeIds);
        if (controlRoleInfos.isEmpty()) {
            // 所有的节点都没有权限，即删除时继承自根节点，返回默认权限
            nodeIds.forEach(controlId -> roleDict.put(controlId, new DefaultWorkbenchRole()));
            return roleDict;
        }
        // 获取已开启了权限的节点ID
        Set<String> enabledPermissionNodeIds = controlRoleInfos.stream().map(ControlRoleInfo::getControlId).collect(Collectors.toSet());
        // 没有权限的节点，返回默认权限
        nodeIds.stream().filter(nodeId -> !enabledPermissionNodeIds.contains(nodeId))
                .forEach(controlId -> roleDict.put(controlId, new DefaultWorkbenchRole()));
        // 过滤组织单元，以节点分组取角色集
        Map<String, Set<String>> nodeRoles = controlRoleInfos.stream()
            .filter(permission -> units.contains(permission.getUnitId()))
            .collect(Collectors.groupingBy(ControlRoleInfo::getControlId, Collectors.mapping(ControlRoleInfo::getRole, Collectors.toSet())));
        if (nodeRoles.isEmpty()) {
            return roleDict;
        }
        // 取最高角色
        nodeRoles.forEach((nodeId, roleCodes) -> roleDict.put(nodeId, ControlRoleManager.getTopNodeRole(roleCodes)));
        return roleDict;
    }

    /**
     * 内部调用服务，需要判断节点是否属于幽灵节点
     */
    private ControlRoleDict getInternalNodeRoles(List<SimpleNodeInfo> nodeList) {
        ControlRoleDict roleDict = ControlRoleDict.create();
        Map<String, SimpleNodeInfo> nodeToInfoMap = nodeList.stream().collect(Collectors.toMap(SimpleNodeInfo::getNodeId, v -> v));

        Map<String, List<String>> reverseParentNodeRoleMap = new LinkedHashMap<>(16);
        Set<String> roleNodeIds = new HashSet<>();
        for (String controlId : getControlIds()) {
            if (!nodeToInfoMap.containsKey(controlId)) {
                continue;
            }
            SimpleNodeInfo node = nodeToInfoMap.get(controlId);
            // 当前节点是指定模式，获取当前节点的权限
            if (!node.getExtend()) {
                roleNodeIds.add(controlId);
            }
            // 查找倒序的父节点，即从下往上
            List<String> reverseParentNodeIds = findParentNodeIdFromBottom2Top(nodeList, node);
            reverseParentNodeRoleMap.put(controlId, reverseParentNodeIds);
            if (reverseParentNodeIds.isEmpty()) {
                continue;
            }
            roleNodeIds.addAll(reverseParentNodeIds);
        }
        // 所有的节点所属父节点都没有权限，或者，节点也没有角色权限，返回默认权限
        if (roleNodeIds.isEmpty()) {
            getControlIds().forEach(controlId -> roleDict.put(controlId, new DefaultWorkbenchRole()));
            return roleDict;
        }

        // 一次性查找父级节点对应的角色，利用算法遍历计算出每个节点的角色配置
        List<ControlRoleInfo> controlRoleInfos = SpringContextHolder.getBean(ControlRoleMapper.class)
                .selectControlRoleInfoByControlIds(roleNodeIds);
        // 将结果做个分组，以节点分组
        Map<String, List<ControlRoleInfo>> nodeRoleMap = controlRoleInfos.stream()
                .collect(Collectors.groupingBy(ControlRoleInfo::getControlId));

        for (String controlId : getControlIds()) {
            if (!nodeToInfoMap.containsKey(controlId)) {
                continue;
            }
            SimpleNodeInfo node = nodeToInfoMap.get(controlId);
            String nodeId = controlId;
            List<String> reverseParentNodeIds = reverseParentNodeRoleMap.get(controlId);
            // 继承模式，权限以上级最靠近的一个指定权限节点为准；指定模式则是以自身为准
            if (node.getExtend()) {
                if (reverseParentNodeIds.isEmpty()) {
                    // 设置默认角色
                    roleDict.put(controlId, new DefaultWorkbenchRole());
                    continue;
                }
                nodeId = reverseParentNodeIds.remove(0);
            }
            // 计算节点角色
            Set<String> roles = calNodeRoles(nodeRoleMap, nodeId, getUnits());
            if (!roles.isEmpty()) {
                // 取最高角色
                roleDict.put(controlId, ControlRoleManager.getTopNodeRole(roles));
            } else {
                // 无权限，肯定不是幽灵节点
                continue;
            }
            // 上级节点均无指定权限，不构成幽灵节点
            if (reverseParentNodeIds.isEmpty()) {
                continue;
            }
            // 从下往上查询是否有上级节点无权限，构成幽灵节点
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
        // 查询节点对应的父级节点ID，为了提高性能，一次性查询所有父级节点，得出当前节点的所有上级
        List<SimpleNodeInfo> nodeList = SpringContextHolder.getBean(NodeMapper.class).selectAllParentNodeIdsByNodeIds(nodeIds, false);
        // 非分享树，或分享节点位于第一层
        if (!shareTreeBuilding || nodeList.size() == getControlIds().size()) {
            return nodeList;
        }
        // 分享树允许断层的幽灵节点保留权限，故不能从上往下计算，而是从分享节点往下计算，避免直接被截断
        // 分享节点在首位
        SimpleNodeInfo node = findNode(nodeList, getControlIds().get(0));
        if (node == null) {
            return null;
        }
        // 分享节点为继承模式
        if (node.getExtend()) {
            // 查找最靠近的一个指定权限父节点，截断之前的上级节点
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
        }
        else {
            // 分享节点是指定模式，截断所有上级节点
            return nodeList.subList(nodeList.size() - getControlIds().size(), nodeList.size());
        }
    }

    /**
     * 查找节点
     * @param simpleNodeInfos 节点列表
     * @param nodeId 节点
     * @return 节点信息
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
     * 递归获取节点的父节点列表
     * @param simpleNodeInfos 节点列表
     * @param node 节点
     * @return 从下往上的父节点列表
     */
    private static Set<String> findParentNodeIdFromTop2Bottom(List<SimpleNodeInfo> simpleNodeInfos, SimpleNodeInfo node) {
        // 查找倒序的父节点
        List<String> parentNodeIds = findParentNodeIdFromBottom2Top(simpleNodeInfos, node);
        // 反转顺序，因为获取是往下往上的，为了权限控制，必须反转顺序，从上往下
        Collections.reverse(parentNodeIds);
        return new LinkedHashSet<>(parentNodeIds);
    }

    /**
     * 查询倒序的父节点
     * @param simpleNodeInfos 节点树列表
     * @param node 节点信息
     * @return 节点ID列表
     */
    private static List<String> findParentNodeIdFromBottom2Top(List<SimpleNodeInfo> simpleNodeInfos, SimpleNodeInfo node) {
        // 查找倒序的父节点，即从下往上
        List<String> parents = new ArrayList<>();
        // 查找所有配置了指定模式的父级节点，有序的，从下往上
        findParentNodeRole(simpleNodeInfos, node, parents::add);
        return parents;
    }

    /**
     * 查找开启角色权限配置的父节点
     * @param simpleNodeInfos 节点列表
     * @param roleInfo 节点树
     * @param parents 拥有权限的父节点
     */
    private static void findParentNodeRole(List<SimpleNodeInfo> simpleNodeInfos, SimpleNodeInfo roleInfo, Consumer<String> parents) {
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
     * 计算节点角色
     * @param nodeRoleMap 节点角色键值对
     * @param nodeId 节点ID
     * @param memberUnitIds 成员所属组织单元列表
     * @return 节点角色
     */
    private static Set<String> calNodeRoles(Map<String, List<ControlRoleInfo>> nodeRoleMap, String nodeId, List<Long> memberUnitIds) {
        List<ControlRoleInfo> permissions = nodeRoleMap.get(nodeId);
        if (permissions == null) {
            return new HashSet<>();
        }
        // 节点的角色对应的组织单元
        Map<String, List<Long>> roleUnitMap = permissions.stream()
            .collect(Collectors.groupingBy(ControlRoleInfo::getRole, Collectors.mapping(ControlRoleInfo::getUnitId, Collectors.toList())));
        return roleUnitMap.entrySet()
            .stream()
            .filter(entry -> memberUnitIds.stream().anyMatch(m -> entry.getValue().contains(m)))
            .map(Map.Entry::getKey).collect(Collectors.toSet());
    }

    /**
     * 得到所有自节点
     * @param simpleNodeInfos 节点列表
     * @param parentNodeId 父节点
     * @return 所有子节点
     */
    private static List<String> findAllChildren(List<SimpleNodeInfo> simpleNodeInfos, String parentNodeId) {
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
     *
     * @param simpleNodeInfos 遍历的节点列表
     * @param parentNodeId 父节点
     * @return 子节点
     */
    private static List<String> findChildren(List<SimpleNodeInfo> simpleNodeInfos, String parentNodeId) {
        List<String> children = new ArrayList<>();
        for (SimpleNodeInfo nodeInfo : simpleNodeInfos) {
            if (nodeInfo.getParentId().equals(parentNodeId)) {
                children.add(nodeInfo.getNodeId());
            }
        }
        return children;
    }
}
