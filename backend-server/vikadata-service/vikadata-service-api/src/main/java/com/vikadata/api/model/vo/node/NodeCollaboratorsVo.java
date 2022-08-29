package com.vikadata.api.model.vo.node;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.model.vo.organization.UnitMemberVo;
import com.vikadata.api.support.serializer.NullArraySerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 节点协作者视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/24 11:02
 */
@Data
@ApiModel("节点角色信息视图")
public class NodeCollaboratorsVo implements Serializable {

    private static final long serialVersionUID = 5137772572237877951L;

    @ApiModelProperty(value = "当前节点权限模式", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean extend;

    @ApiModelProperty(value = "空间管理员列表", position = 2)
    private List<UnitMemberVo> admins;

    @ApiModelProperty(value = "负责人", position = 3)
    private UnitMemberVo owner;

    @ApiModelProperty(value = "自己", position = 4)
    private UnitMemberVo self;

    @ApiModelProperty(value = "节点角色所属组织单元列表", position = 5)
    private List<NodeRoleUnit> roleUnits;

    @ApiModelProperty(value = "节点角色成员列表", position = 6)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<NodeRoleMemberVo> members;

    @ApiModelProperty(value = "继承权限的上级节点名称", position = 7)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String extendNodeName;

    @ApiModelProperty(value = "节点是否属于根目录", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean belongRootFolder;
}
