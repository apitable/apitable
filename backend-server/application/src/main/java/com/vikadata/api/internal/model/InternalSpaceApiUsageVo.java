package com.vikadata.api.internal.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import com.vikadata.api.shared.support.serializer.NullNumberSerializer;

/**
 * space subscription plan resource view
 */
@Data
@ApiModel("space subscription plan resource view")
public class InternalSpaceApiUsageVo {

    @ApiModelProperty(value = "whether to allow over limiting", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAllowOverLimit;

    @ApiModelProperty(value = "api usage used", example = "10000", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long apiUsageUsedCount;

    @ApiModelProperty(value = "maximum api usage", example = "60000", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxApiUsageCount;
}
