package com.vikadata.api.modular.developer.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("verifying lock unlocking ro")
public class UnlockRo {

    @NotBlank(message = "the target value cannot be null")
    @ApiModelProperty(value = "Target: mobile phone or email address", required = true, example = "13800138000", position = 1)
    private String target;

    @ApiModelProperty(value = "type: 0、log in frequently（only phone）；1、verification code is repeatedly obtained within one minute；2、verification code is frequently obtained within 20 minutes（default）", example = "0", position = 3)
    private Integer type = 2;
}
