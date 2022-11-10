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
 * Node collaborator view
 * </p>
 */
@Data
@ApiModel("Node Role Information View")
public class NodeCollaboratorsVo implements Serializable {

    private static final long serialVersionUID = 5137772572237877951L;

    @ApiModelProperty(value = "Current node permission mode", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean extend;

    @ApiModelProperty(value = "Space administrator list", position = 2)
    private List<UnitMemberVo> admins;

    @ApiModelProperty(value = "Person in charge", position = 3)
    private UnitMemberVo owner;

    @ApiModelProperty(value = "Own", position = 4)
    private UnitMemberVo self;

    @ApiModelProperty(value = "Organization unit list of node role", position = 5)
    private List<NodeRoleUnit> roleUnits;

    @ApiModelProperty(value = "Node Role Member List", position = 6)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<NodeRoleMemberVo> members;

    @ApiModelProperty(value = "Name of the parent node that inherits permissions", position = 7)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String extendNodeName;

    @ApiModelProperty(value = "Whether the node belongs to the root directory", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean belongRootFolder;
}
