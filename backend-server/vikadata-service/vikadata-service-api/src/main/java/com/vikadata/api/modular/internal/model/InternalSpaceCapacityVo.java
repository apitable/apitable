package com.vikadata.api.modular.internal.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;

/**
 * attachment capacity information view for spaces
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Attachment capacity information view for spaces")
public class InternalSpaceCapacityVo {

    @ApiModelProperty(value = "whether to allow over limiting", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAllowOverLimit;

    @ApiModelProperty(value = "used capacity unit byte", dataType = "java.lang.String", example = "1024", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long usedCapacity;

    @ApiModelProperty(value = "total capacity unit byte", dataType = "java.lang.String", example = "1024", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long totalCapacity;

    @ApiModelProperty(value = "current package capacity unit byte", dataType = "java.lang.String", example = "1024", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long currentBundleCapacity;

    @ApiModelProperty(value = "gift unexpired capacity unit byte", dataType = "java.lang.String", example = "1024", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long unExpireGiftCapacity;
}
