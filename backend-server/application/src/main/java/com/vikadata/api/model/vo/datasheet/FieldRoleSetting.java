package com.vikadata.api.model.vo.datasheet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullBooleanSerializer;

@Data
@ApiModel("Attribute View of Digital Table Field Role Configuration")
public class FieldRoleSetting {

    @ApiModelProperty(value = "Enable Allow Collection Table Access", dataType = "java.lang.Boolean", example = "true", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean formSheetAccessible;
}
