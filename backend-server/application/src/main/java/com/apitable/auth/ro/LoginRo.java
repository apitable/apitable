/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.auth.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.auth.enums.LoginType;

/**
 * <p>
 * Login Request Parameters
 * </p>
 */
@Data
@ApiModel("Authorization Request Parameters")
public class LoginRo {

    @ApiModelProperty(value = "Login Name", example = "13829291111 ｜ xxxx@apitable.com", position = 1, required = true)
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
