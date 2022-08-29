package com.vikadata.api.model.vo.node;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.support.serializer.NullBooleanSerializer;

/**
 * <p>
 * 字段权限集
 * </p>
 *
 * @author Chambers
 * @date 2021/4/16
 */
@Data
public class FieldPermission {

    @ApiModelProperty(value = "可查看的", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean readable;

    @ApiModelProperty(value = "可编辑的", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean editable;
}
