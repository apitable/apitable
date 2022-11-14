package com.vikadata.api.enterprise.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * DingTalk User Login Request Parameters
 */
@ApiModel("DingTalk ISV Application Administrator Platform Password free Login Request Parameters")
@Data
public class DingTalkIsvAminUserLoginRo {
    @NotBlank(message = "Code cannot be empty")
    @ApiModelProperty(value = "Registration free authorization code", required = true, position = 1)
    private String code;

    @ApiModelProperty(value = "Enterprise ID", position = 1)
    private String corpId;
}
