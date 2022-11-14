package com.vikadata.api.enterprise.social.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Verify whether Lark enterprise has bound the space
 */
@Data
@ApiModel("Verify whether Lark enterprise has bound the space ")
public class FeishuTenantBindVO {

    @ApiModelProperty(value = "Bound or not", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasBind;
}
