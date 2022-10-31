package com.vikadata.api.modular.appstore.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Create application instance request parameters
 */
@Data
@ApiModel("Create application instance request parameters")
public class CreateAppInstance {

    @NotBlank
    @ApiModelProperty(value = "Space Id", example = "spc21u12h3")
    private String spaceId;

    @NotBlank
    @ApiModelProperty(value = "Application ID of application store", example = "app-jh1237123")
    private String appId;
}
