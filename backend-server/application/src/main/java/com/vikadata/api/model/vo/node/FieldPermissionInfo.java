package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.model.vo.datasheet.FieldRoleSetting;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * Field Permission View Information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Field Permission View Information")
public class FieldPermissionInfo {

    @ApiModelProperty(value = "Field ID", example = "fldUQZGaNqSg2", position = 1)
    private String fieldId;

    @ApiModelProperty(value = "Data Table Field Role Configuration Attribute", position = 2)
    private FieldRoleSetting setting;

    @ApiModelProperty(value = "Whether you have permission", example = "true", position = 3)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasRole;

    @ApiModelProperty(value = "Role", example = "true", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String role;

    @ApiModelProperty(value = "Whether column roles can be managed", example = "true", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean manageable;

    @ApiModelProperty(value = "Field permission set", position = 6)
    private FieldPermission permission;
}
