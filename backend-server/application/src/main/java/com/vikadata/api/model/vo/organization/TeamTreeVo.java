package com.vikadata.api.model.vo.organization;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.vikadata.core.support.tree.Tree;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * Department Tree View
 * </p>
 */
@Data
@ApiModel("Department Tree View")
public class TeamTreeVo implements Tree {

    @ApiModelProperty(value = "Department ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @ApiModelProperty(value = "Department name", example = "R&D Department", position = 2)
    private String teamName;

    @ApiModelProperty(value = "Parent ID, 0 if the parent is root", dataType = "java.lang.String", example = "0", position = 3)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long parentId;

    @ApiModelProperty(value = "Number of department members", example = "3", position = 4)
    private Integer memberCount;

    @ApiModelProperty(value = "Sort No", example = "1", position = 5)
    private Integer sequence;

    @ApiModelProperty(value = "Subsidiary department", position = 7)
    private List<TeamTreeVo> children = new ArrayList<>();

    @JsonIgnore
    @Override
    public String getNodeId() {
        return String.valueOf(this.teamId);
    }

    @JsonIgnore
    @Override
    public String getNodeParentId() {
        return String.valueOf(this.parentId);
    }

    @JsonIgnore
    @Override
    public List<TeamTreeVo> getChildrenNodes() {
        return this.children;
    }

    @Override
    public void setChildrenNodes(List childrenNodes) {
        this.children = childrenNodes;
    }
}
