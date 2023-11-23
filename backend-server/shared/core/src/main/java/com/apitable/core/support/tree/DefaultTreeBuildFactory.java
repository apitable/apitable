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

package com.apitable.core.support.tree;

import cn.hutool.core.collection.CollUtil;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * default recursive tool, used to traverse nodes that have parent-child relationships.
 * such as menu trees, dictionary trees, and so on.
 * </p>
 */
public class DefaultTreeBuildFactory<T extends Tree> extends AbstractTreeBuildFactory<T> {

    /**
     * the root node's id.
     */
    public static final String ROOT_PARENT_ID = "0";

    private String rootNode = ROOT_PARENT_ID;

    public DefaultTreeBuildFactory() {
    }

    public DefaultTreeBuildFactory(String rootNode) {
        this.rootNode = rootNode;
    }

    /**
     * query a collection of child nodes.
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
     * gets the node's child nodes.
     *
     * @param list the list of nodes
     * @param node the node to be queried
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
