package com.vikadata.api.model.vo.node;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import com.vikadata.api.support.serializer.NullArraySerializer;
import com.vikadata.core.support.tree.Tree;

/**
 * Node Tree View
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel("Node Tree View")
public class NodeInfoTreeVo extends NodeInfoVo implements Tree {

    @ApiModelProperty(value = "Child Node List", position = 15)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<NodeInfoTreeVo> children;

    @JsonIgnore
    @Override
    public String getNodeParentId() {
        return getParentId();
    }

    @JsonIgnore
    @Override
    public List<NodeInfoTreeVo> getChildrenNodes() {
        return this.children;
    }

    @Override
    public void setChildrenNodes(List childrenNodes) {
        this.children = childrenNodes;
    }
}
