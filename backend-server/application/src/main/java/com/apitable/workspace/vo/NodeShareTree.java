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

import com.apitable.core.support.tree.Tree;
import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * View of the number of shared nodes.
 * </p>
 */
@Data
@Schema(description = "View of the number of shared nodes")
public class NodeShareTree implements Tree {

    @Schema(description = "Node ID", example = "nod10")
    private String nodeId;

    @Schema(description = "Node Name", example = "Node Name")
    private String nodeName;

    @Schema(description = "Node icon", example = ":smile")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String icon;

    @JsonIgnore
    private String parentId;

    @JsonIgnore
    private String preNodeId;

    @JsonIgnore
    private String cover;

    @Schema(description = "Node extra")
    private String extra;

    @Schema(description = "Node Type[1:Folder,2:Datasheet]", example = "1")
    private Integer type;

    @Schema(description = "node private", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean nodePrivate;

    @Schema(description = "Child node")
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
    public List<NodeShareTree> getChildrenNodes() {
        return this.children;
    }

    @Override
    public void setChildrenNodes(List childrenNodes) {
        this.children = childrenNodes;
    }
}
