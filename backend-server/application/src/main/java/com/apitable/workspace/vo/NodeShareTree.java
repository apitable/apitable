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

package com.apitable.workspace.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.apitable.core.support.tree.Tree;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * View of the number of shared nodes
 * </p>
 */
@Data
@ApiModel("View of the number of shared nodes")
public class NodeShareTree implements Tree {

    @ApiModelProperty(value = "Node ID", example = "nod10", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "Node Name", example = "Node Name", position = 2)
    private String nodeName;

    @ApiModelProperty(value = "Node icon", example = ":smile", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String icon;

    @JsonIgnore
    private String parentId;

    @JsonIgnore
    private String preNodeId;

    @JsonIgnore
    private String cover;

    @JsonIgnore
    private String extra;

    @ApiModelProperty(value = "Node Type[1:Folder,2:Datasheet]", example = "1", position = 4)
    private Integer type;

    @ApiModelProperty(value = "Child node", position = 4)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<NodeShareTree> children;

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
        return this.children;
    }

    @Override
    public void setChildrenNodes(List childrenNodes) {
        this.children = childrenNodes;
    }
}
