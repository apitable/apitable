package com.vikadata.core.support.tree;

import cn.hutool.core.collection.CollUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 *     default recursive tool, used to traverse nodes that have parent-child relationships.
 *     such as menu trees, dictionary trees, and so on.
 * </p>
 */
public class DefaultTreeBuildFactory<T extends Tree> extends AbstractTreeBuildFactory<T> {

    /**
     * the root node's id
     */
    public static final String ROOT_PARENT_ID = "0";

    private String rootNode = ROOT_PARENT_ID;

	public DefaultTreeBuildFactory() {
	}

	public DefaultTreeBuildFactory(String rootNode) {
		this.rootNode = rootNode;
	}

	/**
     * query a collection of child nodes
     *
     * @param totalNodes     the list of all nodes
     * @param node           node to be queried
     * @param childNodeLists the child nodes of the queried node
     */
    private void buildChildNodes(List<T> totalNodes, T node, List<T> childNodeLists) {
        if (totalNodes == null || node == null) {
            return;
        }

        List<T> nodeSubLists = getSubChildLevelOne(totalNodes, node);

        if (CollUtil.isNotEmpty(nodeSubLists)) {
            for (T nodeSubList : nodeSubLists) {
                buildChildNodes(totalNodes, nodeSubList, new ArrayList<>());
            }
        }

        childNodeLists.addAll(nodeSubLists);
        node.setChildrenNodes(childNodeLists);
    }

    /**
     * gets the node's child nodes
     *
     * @param list  the list of nodes
     * @param node  the node to be queried
     */
    private List<T> getSubChildLevelOne(List<T> list, T node) {
        List<T> nodeList = new ArrayList<>();
        for (T nodeItem : list) {
            if (nodeItem.getNodeParentId().equals(node.getNodeId())) {
                nodeList.add(nodeItem);
            }
        }
        return nodeList;
    }

    @Override
    protected List<T> beforeBuild(List<T> nodes) {
        // By default, no preprocessing before build.
        return nodes;
    }

    @Override
    protected List<T> executeBuilding(List<T> nodes) {
        for (T treeNode : nodes) {
            this.buildChildNodes(nodes, treeNode, new ArrayList<>());
        }
        return nodes;
    }

    @Override
    protected List<T> afterBuild(List<T> nodes) {

        //remove all secondary nodes
        ArrayList<T> results = new ArrayList<>();
        for (T node : nodes) {
            if (node.getNodeParentId().equals(rootNode)) {
                results.add(node);
            }
        }
        return results;
    }
}
