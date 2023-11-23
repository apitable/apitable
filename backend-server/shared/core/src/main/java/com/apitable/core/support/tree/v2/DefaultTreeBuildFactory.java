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

package com.apitable.core.support.tree.v2;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * V2 default recursive tool, used to traverse nodes that have parent-child relationships.
 * such as menu trees, dictionary trees, and so on.
 * </p>
 */
public class DefaultTreeBuildFactory<T extends Tree> extends AbstractTreeBuildFactory<T> {

    /**
     * the root node's id.
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
     * build tree.
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
