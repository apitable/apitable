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

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ReflectUtil;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * <p>
 * tree tool.
 * </p>
 */
@SuppressWarnings("unchecked")
public class TreeUtil {

    /**
     * build the tree by default tree builder factory.
     *
     * @param totalNodes the tree node list
     * @return List
     */
    public static <T extends Tree> List<T> build(List<T> totalNodes) {
        return build(totalNodes, DefaultTreeBuildFactory.ROOT_PARENT_ID,
            new DefaultTreeBuildFactory<>());
    }

    /**
     * build the tree by default factory.
     *
     * @param totalNodes the tree node list
     * @param rootId     the root node id, generally 0
     * @return List
     */
    public static <T extends Tree> List<T> build(List<T> totalNodes, String rootId) {
        return build(totalNodes, rootId, new DefaultTreeBuildFactory<>());
    }

    /**
     * build tree.
     *
     * @param totalNodes        the tree node list
     * @param rootId            the root node id, generally 0
     * @param abstractTreeBuild tree builder factory
     * @return List
     */
    public static <T extends Tree> List<T> build(List<T> totalNodes, String rootId,
                                                 AbstractTreeBuildFactory<T> abstractTreeBuild) {
        return abstractTreeBuild.setRootNode(rootId).doTreeBuild(totalNodes);
    }

    /**
     * select node by node id in node list.
     *
     * @param treeList the tree node list
     * @param id       the node id
     * @return T
     */
    public static <T extends Tree> T find(Collection<T> treeList, String id) {
        T t;
        for (T tree : treeList) {
            if (tree.getId().equals(id)) {
                return tree;
            } else {
                List<T> children = tree.getChildren();
                if (children != null && !children.isEmpty()) {
                    t = find(children, id);

                    if (t != null) {
                        return t;
                    }
                }
            }
        }
        return null;
    }

    /**
     * tree to list, but not destroy the original list.
     */
    public static <T extends Tree> List<T> treeToList(T node) {
        return treeToList(node, 0, null);
    }

    /**
     * tree to list, but not destroy the original list.
     */
    public static <T extends Tree> List<T> treeToList(T node, int deep, Integer maxDeep) {
        return treeToList(Collections.singletonList(node), deep, maxDeep);
    }

    /**
     * tree to list, but not destroy the original list.
     */
    public static <T extends Tree> List<T> treeToList(List<T> nodes) {
        return treeToList(nodes, 0, null);
    }

    /**
     * tree to list, but not destroy the original list.
     *
     * @param nodes   the tree node list
     * @param deep    the recursion's deep
     * @param maxDeep the recursion's maximum deep. may be null, meaning no limit
     * @return the initial tree node list
     */
    public static <T extends Tree> List<T> treeToList(List<T> nodes, int deep, Integer maxDeep) {
        List<T> result = new ArrayList<>();

        // maxDeep may be null
        if (maxDeep != null && deep >= maxDeep) {
            return new ArrayList<>();
        }

        // children node's traversal & recursion
        for (T node : nodes) {
            T t;
            BeanUtil.copyProperties(node, t = (T) ReflectUtil.newInstance(node.getClass()),
                CopyOptions.create().ignoreError());
            // clear children
            t.setChildren(null);
            result.add(t);

            if (CollUtil.isNotEmpty(node.getChildren())) {
                result.addAll(treeToList(node.getChildren(), deep + 1, maxDeep));
            }
        }
        return result;
    }

}
