package com.vikadata.api.workspace.vo;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.NullArraySerializer;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;

/**
 * <p>
 * Data Table Field Role Information View
 * </p>
 */
@Data
@ApiModel("Data Table Field Permission View")
public class FieldCollaboratorVO {

    @ApiModelProperty(value = "Whether to open", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean enabled;

    @ApiModelProperty(value = "Role Member List", position = 3)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<FieldRoleMemberVo> members;

    @ApiModelProperty(value = "Role Org Unit List", position = 4)
    private List<FieldRole> roles;

    @ApiModelProperty(value = "Data Table Field Role Configuration Attribute", position = 5)
    private FieldRoleSetting setting;
}
