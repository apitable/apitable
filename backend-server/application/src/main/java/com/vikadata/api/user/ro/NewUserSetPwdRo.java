package com.vikadata.api.user.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * New user sets password request parameters
 */
@Data
@ApiModel("New user sets password request parameters")
public class NewUserSetPwdRo {

    @ApiModelProperty(value = "Phone number", example = "135...", position = 1, required = true)
    private String phone;

    @ApiModelProperty(value = "New password", example = "qwer1234", position = 2, required = true)
    private String newPassword;

    @ApiModelProperty(value = "Confirm Password", example = "qwer1234", position = 3, required = true)
    private String confirmPassword;
}
