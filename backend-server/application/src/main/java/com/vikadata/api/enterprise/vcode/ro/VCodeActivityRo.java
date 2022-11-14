package com.vikadata.api.enterprise.vcode.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * <p>
 * Code V activity request parameters
 * </p>
 */
@Data
@ApiModel("Code V activity request parameters")
public class VCodeActivityRo {

    @ApiModelProperty(value = "Activity Name", example = "XX Channel promotion", position = 1, required = true)
    @NotBlank(message = "Name cannot be empty")
    private String name;

    @ApiModelProperty(value = "Scene Values", example = "XX_channel_popularize", position = 2, required = true)
    @NotBlank(message = "The scene value cannot be empty")
    private String scene;

}
