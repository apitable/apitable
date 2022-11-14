package com.vikadata.api.enterprise.control.model;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Field Control
 */
@Data
@ApiModel("Field Permission Properties")
public class FieldControlProp {

    @NotNull(message = "formSheetAccessible 不能为null")
    @ApiModelProperty(value = "Allow collection table access", dataType = "java.lang.Boolean", example = "true", position = 1)
    private Boolean formSheetAccessible;
}
