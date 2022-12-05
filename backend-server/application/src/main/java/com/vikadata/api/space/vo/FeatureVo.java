package com.vikadata.api.space.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Internal test function status value object
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Internal test function status")
public class FeatureVo {

    @ApiModelProperty(value = "Unique identification of laboratory function", dataType = "java.lang.String", example = "robot", position = 1)
    private String key;

    @ApiModelProperty(value = "Laboratory function category", dataType = "java.lang.String", example = "review", position = 2)
    private String type;

    @ApiModelProperty(value = "Laboratory function application internal test form url", dataType = "java.lang.String", position = 3)
    private String url;

    @ApiModelProperty(value = "Laboratory function opening status", dataType = "java.lang.Boolean", example = "true", position = 4)
    private Boolean open;
}
