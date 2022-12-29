package com.vikadata.api.workspace.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;

/**
 * <p>
 * Field permission set
 * </p>
 */
@Data
public class FieldPermission {

    @ApiModelProperty(value = "Viewable", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean readable;

    @ApiModelProperty(value = "Editable", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean editable;
}
