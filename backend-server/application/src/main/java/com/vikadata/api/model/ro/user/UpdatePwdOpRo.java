package com.vikadata.api.model.ro.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.enums.action.ValidateType;

/**
 * <p>
 * Modify password request parameters
 * </p>
 */
@Data
@ApiModel("Modify password request parameters")
public class UpdatePwdOpRo {

    @ApiModelProperty(value = "Check Type", example = "sms_code")
    private ValidateType type;

    @ApiModelProperty(value = "Phone number/Email Verification Code", example = "123456", position = 2)
    private String code;

    @ApiModelProperty(value = "Password", example = "qwer1234", position = 3, required = true)
    private String password;
}
