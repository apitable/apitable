package com.vikadata.api.modular.control.model;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-07 17:15:52
 */
@Data
@ApiModel("字段权限属性")
public class FieldControlProp {

    @NotNull(message = "formSheetAccessible 不能为null")
    @ApiModelProperty(value = "是否允许收集表访问", dataType = "java.lang.Boolean", example = "true", position = 1)
    private Boolean formSheetAccessible;
}
