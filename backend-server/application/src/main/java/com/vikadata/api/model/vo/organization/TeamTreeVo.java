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
 * 部门树形视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/4 19:13
 */
@Data
@ApiModel("部门树形视图")
public class TeamTreeVo implements Tree {

    @ApiModelProperty(value = "部门ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @ApiModelProperty(value = "部门名称", example = "研发部", position = 2)
    private String teamName;

    @ApiModelProperty(value = "父级ID,如果父级是根,则为0", dataType = "java.lang.String", example = "0", position = 3)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long parentId;

    @ApiModelProperty(value = "部门成员数量", example = "3", position = 4)
    private Integer memberCount;

    @ApiModelProperty(value = "排序号", example = "1", position = 5)
    private Integer sequence;

    @ApiModelProperty(value = "子部门", position = 7)
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
