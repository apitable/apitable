package com.vikadata.api.user.ro;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Mobile verification code verification request parameters
 */
@Data
@ApiModel("Mobile verification code verification request parameters")
public class SmsCodeValidateRo {

    @NotBlank(message = "Mobile phone area code cannot be empty")
    @ApiModelProperty(value = "Area code", example = "+86", position = 1, required = true)
    private String areaCode;

    @ApiModelProperty(value = "Phone number", example = "13411112222", position = 2, required = true)
    @NotBlank(message = "Mobile number cannot be empty")
    private String phone;

    @ApiModelProperty(value = "Mobile phone verification code", example = "123456", position = 3, required = true)
    @NotBlank(message = "The verification code cannot be empty")
    private String code;
}
