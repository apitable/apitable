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

package com.apitable.workspace.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.apitable.core.support.tree.Tree;
import lombok.Data;

import java.util.List;

@Data
public class NodeFileTree implements Tree {

    private String nodeId;

    private String parentId;

    private String nodeName;

    private String icon;

    private Integer type;

    private String cover;

    /**
     * data file name，map files in `/data`
     */
    private String data;

    /**
     * child node
     */
    private List<NodeFileTree> child;

    public NodeFileTree() {
    }

    public NodeFileTree(String parentId, String nodeId, String name, String icon, Integer type, String cover, String data) {
        this.parentId = parentId;
        this.nodeId = nodeId;
        this.nodeName = name;
        this.icon = icon;
        this.type = type;
        this.cover = cover;
        this.data = data;
    }

    @Override
    public String getNodeId() {
        return this.nodeId;
    }

    @JsonIgnore
    @Override
    public String getNodeParentId() {
        return this.parentId;
    }

    @JsonIgnore
    @Override
    public List getChildrenNodes() {
        return this.child;
    }

    @Override
    public void setChildrenNodes(List childrenNodes) {
        this.child = childrenNodes;
    }
}
