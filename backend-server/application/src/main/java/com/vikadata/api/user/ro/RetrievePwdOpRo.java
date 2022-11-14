package com.vikadata.api.user.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.base.enums.ValidateType;

/**
 * Retrieve password request parameters
 */
@Data
@ApiModel("Retrieve password request parameters")
public class RetrievePwdOpRo {

    @ApiModelProperty(value = "Check type", example = "sms_code")
    private ValidateType type;

    @ApiModelProperty(value = "Area code（Required for SMS verification code）", example = "+86", position = 1)
    private String areaCode;

    @ApiModelProperty(value = "Login Name（Phone number/Email）", example = "13829291111 ｜ xxx@xx.com", position = 1, required = true)
    private String username;

    @Deprecated
    @ApiModelProperty(value = "Phone number", example = "135...", position = 1)
    private String phone;

    @ApiModelProperty(value = "Phone number/Email Verification Code", example = "123456", position = 2, required = true)
    private String code;

    @ApiModelProperty(value = "Password", example = "qwer1234", position = 2, required = true)
    private String password;

    @Deprecated
    public String getUsername() {
        // Compatible processing
        if (username == null) {
            return phone;
        }
        return username;
    }
}
