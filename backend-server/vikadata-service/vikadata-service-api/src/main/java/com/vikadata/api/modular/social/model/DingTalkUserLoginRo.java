package com.vikadata.api.modular.social.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * DingTalk User Login Request Parameters
 */
@ApiModel("DingTalk Application User Login Request Parameters")
@Data
public class DingTalkUserLoginRo {
    @NotBlank
    @ApiModelProperty(value = "Registration free authorization code", required = true, position = 2)
    private String code;
}
