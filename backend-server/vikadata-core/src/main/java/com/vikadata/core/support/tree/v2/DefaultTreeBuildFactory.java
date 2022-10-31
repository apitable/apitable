package com.vikadata.core.support.tree.v2;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * V2 default recursive tool, used to traverse nodes that have parent-child relationships.
 *     such as menu trees, dictionary trees, and so on.
 * </p>
 */
public class DefaultTreeBuildFactory<T extends Tree> extends AbstractTreeBuildFactory<T> {
    /**
     * the root node's id
     */
    public static final String ROOT_PARENT_ID = "0";

    private String rootNode = ROOT_PARENT_ID;

    @Override
    protected void setRoot(String rootNode) {
        if (StrUtil.isNotEmpty(rootNode)) {
            this.rootNode = rootNode;
        }
    }

    @Override
    protected List<T> beforeBuild(List<T> nodes) {
        // By default, no preprocessing before build.
        // no destroying the original data structure to repeatedly build the tree.
        return ObjectUtil.cloneByStream(nodes);
    }

    @Override
    protected List<T> executeBuilding(List<T> nodes) {
        return this.build(nodes, this.rootNode);
    }

    @Override
    protected List<T> afterBuild(List<T> nodes) {
        // By default, no preprocessing after build.
        return nodes;
    }

    /**
     * build tree
     *
     * @param totalNodes the node list
     * @param rootId     the root node id, generally 0
     */
    private List<T> build(List<T> totalNodes, String rootId) {
        if (null == totalNodes || null == rootId) {
            return null;
        }

        final Map<String, T> eTreeMap = new LinkedHashMap<>(totalNodes.size(), 1);

        for (T totalNode : totalNodes) {
            eTreeMap.put(totalNode.getId(), totalNode);
        }

        List<T> rootTreeList = CollUtil.newArrayList();
        String parentId;
        for (T node : eTreeMap.values()) {
            // When no children, building an empty object
            if (CollUtil.isEmpty(node.getChildren())) {
                node.setChildren(new ArrayList<>());
            }
            parentId = node.getParentId();
            if (ObjectUtil.equals(rootId, parentId)) {
                rootTreeList.add(node);
                continue;
            }

            final T parentNode = eTreeMap.get(parentId);
            if (null != parentNode) {
                parentNode.addChildren(node);
            }
        }
        return rootTreeList;
    }

}
