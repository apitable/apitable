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

import cn.hutool.core.util.ArrayUtil;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * V2 interface: the tree node's behavior.
 * </p>
 */
@SuppressWarnings("unchecked")
public interface Tree extends Serializable {

    /**
     * get the node's id.
     *
     * @return node id
     */
    String getId();

    /**
     * get the parent node's id.
     *
     * @return the parent node id
     */
    String getParentId();

    /**
     * set the parent node's id.
     *
     * @param parentId the parent node id
     */
    void setParentId(String parentId);

    /**
     * get the child nodes.
     *
     * @return the list of children nodes
     */
    List getChildren();

    /**
     * set the child nodes.
     *
     * @param children the list of children nodes
     */
    void setChildren(List children);

    /**
     * set the tree level.
     *
     * @param level the tree level
     */
    void setLevel(int level);

    /**
     * get the tree level.
     *
     * @return the tree level
     */
    int getLevel();

    /**
     * add child node，and set the child node's parent node is this node.
     *
     * @param children the list of children nodes
     * @return this
     */
    default Tree addChildren(Tree... children) {
        if (ArrayUtil.isNotEmpty(children)) {
            List<Tree> childrenList = this.getChildren();
            if (null == childrenList) {
                childrenList = new ArrayList<>();
                this.setChildren(childrenList);
            }
            for (Tree child : children) {
                if (null != child) {
                    child.setParentId(this.getId());
                    child.setLevel(this.getLevel() + 1);
                }
                childrenList.add(child);
            }
        }
        return this;
    }

}
