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

import com.apitable.auth.enums.LoginType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import lombok.Data;

/**
 * <p>
 * Login Request Parameters.
 * </p>
 */
@Data
@Schema(description = "Authorization Request Parameters")
public class LoginRo {

    @Schema(description = "Login Name", example = "13829291111 ｜ xxxx@apitable.com",
        requiredMode = RequiredMode.REQUIRED)
    private String username;

    @Schema(description = "Login voucher, identified according to verify type",
        example = "qwer1234 || 261527", requiredMode = RequiredMode.REQUIRED)
    private String credential;

    @Schema(description = "Login Type, fixed value, only password（Password）、sms_code（SMS "
        + "verification）、email_code（Email verification code）、wechat_sms_code（WeChat applet SMS "
        + "verification code）、sso_auth can be input", example = "password",
        requiredMode = RequiredMode.REQUIRED)
    private LoginType type;

    @Schema(description = "Area code（cell-phone number + password/SMS verification code, "
        + "Required for login）", example = "+86")
    private String areaCode;

    @Schema(description = "Password login for man-machine verification, and the front end "
        + "obtains the value of get NVC Val function", example = "FutureIsComing",
        requiredMode = RequiredMode.REQUIRED)
    private String data;

    @Schema(description = "The token temporarily saved by the third-party account information"
        + " is returned when there is no binding to the account", example = "this_is_token")
    private String token;

    @Schema(description = "Invite space ID, which is required when new users are invited to "
        + "join the space station to get free attachment capacity", example = "spcaq8UwsxjAc")
    private String spaceId;
}
