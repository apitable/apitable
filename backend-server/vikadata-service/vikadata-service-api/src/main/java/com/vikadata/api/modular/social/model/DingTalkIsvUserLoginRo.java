package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * DingTalk User Login Request Parameters
 */
@ApiModel("DingTalk ISV Application User Login Request Parameters")
@Data
public class DingTalkIsvUserLoginRo {
    @NotBlank
    @ApiModelProperty(value = "Registration free authorization code", required = true, position = 1)
    private String code;

    @NotBlank(message = "The corpId is incorrect")
    @ApiModelProperty(value = "Authorized enterprise ID", required = true, position = 2)
    private String corpId;

    @ApiModelProperty(value = "DingTalk application instance id", position = 3)
    private String bizAppId;
}
