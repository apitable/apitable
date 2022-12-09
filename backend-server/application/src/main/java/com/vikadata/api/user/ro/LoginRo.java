package com.vikadata.api.user.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.base.enums.LoginType;

/**
 * <p>
 * Login Request Parameters
 * </p>
 */
@Data
@ApiModel("Authorization Request Parameters")
public class LoginRo {

    @ApiModelProperty(value = "Login Name", example = "13829291111 ｜ xxxx@vikadata.com", position = 1, required = true)
    private String username;

    @ApiModelProperty(value = "Login voucher, identified according to verify type", example = "qwer1234 || 261527", position = 2, required = true)
    private String credential;

    @ApiModelProperty(value = "Login Type, fixed value, only password（Password）、sms_code（SMS verification）、email_code（Email verification code）、wechat_sms_code（WeChat applet SMS verification code）、sso_auth can be input", example = "password", position = 3, required = true)
    private LoginType type;

    @ApiModelProperty(value = "Area code（cell-phone number + password/SMS verification code, Required for login）", example = "+86", position = 4)
    private String areaCode;

    @ApiModelProperty(value = "Password login for man-machine verification, and the front end obtains the value of get NVC Val function", example = "FutureIsComing", position = 4, required = true)
    private String data;

    @ApiModelProperty(value = "The token temporarily saved by the third-party account information is returned when there is no binding to the account", example = "this_is_token", position = 5)
    private String token;

    @ApiModelProperty(value = "Invite space ID, which is required when new users are invited to join the space station to get free attachment capacity", example = "spcaq8UwsxjAc", position = 6)
    private String spaceId;
}
