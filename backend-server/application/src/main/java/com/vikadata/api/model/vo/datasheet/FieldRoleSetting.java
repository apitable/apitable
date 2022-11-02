package com.vikadata.api.model.vo.datasheet;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullBooleanSerializer;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-12 00:17:02
 */
@Data
@ApiModel("数表字段角色配置属性视图")
public class FieldRoleSetting {

    @ApiModelProperty(value = "是否开启允许收集表访问", dataType = "java.lang.Boolean", example = "true", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean formSheetAccessible;
}
