package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.NullArraySerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import com.vikadata.core.support.tree.Tree;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>
 * 分享节点数视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/24 14:00
 */
@Data
@ApiModel("分享节点数视图")
public class NodeShareTree implements Tree {

    @ApiModelProperty(value = "节点ID", example = "nod10", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "节点名称", example = "节点名称", position = 2)
    private String nodeName;

    @ApiModelProperty(value = "节点图标", example = ":smile", position = 3)
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

    @ApiModelProperty(value = "节点类型[1:文件夹,2:数表]", example = "1", position = 4)
    private Integer type;

    @ApiModelProperty(value = "子节点", position = 4)
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
