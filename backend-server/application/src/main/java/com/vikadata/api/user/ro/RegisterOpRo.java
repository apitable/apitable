package com.vikadata.api.user.ro;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Register operation request parameters
 */
@Data
@ApiModel("Register operation request parameters")
public class RegisterOpRo {

    @ApiModelProperty(value = "Save the token of WeChat union ID and mobile phone number", example = "thisistoken", position = 1, required = true)
    @NotBlank(message = "Token cannot be empty")
    private String token;

    @ApiModelProperty(value = "Registration invitation code", example = "vikatest", position = 2, required = true)
    private String inviteCode;
}
