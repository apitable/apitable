package com.vikadata.api.space.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.NullNumberSerializer;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Attachment capacity information view for spaces")
public class SpaceCapacityVO {

    @ApiModelProperty(value = "used capacity unit byte", dataType = "java.lang.String", example = "1024", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long usedCapacity;

    @ApiModelProperty(value = "current package capacity unit byte", dataType = "java.lang.String", example = "1024", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long currentBundleCapacity;
}
