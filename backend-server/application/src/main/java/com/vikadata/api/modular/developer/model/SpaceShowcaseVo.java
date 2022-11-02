package com.vikadata.api.modular.developer.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@ApiModel("Space Info")
public class SpaceShowcaseVo {

    @ApiModelProperty(value = "space id", example = "spcxxx", position = 1, required = true)
    private String spaceId;

    @ApiModelProperty(value = "space name", example = "space", position = 2, required = true)
    private String spaceName;

    @ApiModelProperty(value = "creation time", example = "2020/10/10", position = 3, required = true)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;
}
