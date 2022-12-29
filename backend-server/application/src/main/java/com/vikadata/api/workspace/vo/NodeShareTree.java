package com.vikadata.api.workspace.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.shared.support.serializer.NullArraySerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;
import com.vikadata.core.support.tree.Tree;
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
