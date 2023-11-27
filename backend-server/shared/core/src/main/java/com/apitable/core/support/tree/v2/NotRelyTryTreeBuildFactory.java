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
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

/**
 * <p>
 * V2 Try to build tree nodes without dependencies.
 * Note: sort the List externally, the incoming List is ordered.
 * </p>
 */
public class NotRelyTryTreeBuildFactory<T extends Tree> extends AbstractTreeBuildFactory<T> {

    @Override
    protected void setRoot(String rootNode) {
    }

    @Override
    protected List<T> beforeBuild(List<T> nodes) {
        // By default, no preprocessing before build.
        // no destroying the original data structure to repeatedly build the tree.
        return ObjectUtil.cloneByStream(nodes);
    }

    @Override
    protected List<T> executeBuilding(List<T> nodes) {
        return this.build(nodes);
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
     */
    private List<T> build(List<T> totalNodes) {
        if (null == totalNodes || totalNodes.isEmpty()) {
            return new ArrayList<>();
        }

        final Map<String, T> eTreeMap = new LinkedHashMap<>(totalNodes.size(), 1);

        for (T totalNode : totalNodes) {
            eTreeMap.put(totalNode.getId(), totalNode);
        }

        // By default, using the first element parent id as the first match
        Entry<String, T> next = eTreeMap.entrySet().iterator().next();
        String basisParentId =
            null == next ? DefaultTreeBuildFactory.ROOT_PARENT_ID : next.getValue().getParentId();

        List<T> rootTreeList = CollUtil.newArrayList();
        String parentId;
        for (Entry<String, T> entry : eTreeMap.entrySet()) {
            T node = entry.getValue();
            // When no children, building an empty object
            if (CollUtil.isEmpty(node.getChildren())) {
                node.setChildren(new ArrayList<>());
            }

            parentId = node.getParentId();
            if (ObjectUtil.equals(basisParentId, parentId)) {
                rootTreeList.add(node);
                continue;
            }

            final T parentNode = eTreeMap.get(parentId);
            if (null != parentNode) {
                parentNode.addChildren(node);
            } else {
                // If no matching node, the replacement condition is used for the next round of matching
                basisParentId = parentId;
                rootTreeList.add(node);
            }
        }

        return rootTreeList;
    }

}
