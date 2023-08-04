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

package com.apitable.user.ro;

import com.apitable.base.enums.ValidateType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import lombok.Data;

/**
 * Retrieve password request parameters.
 */
@Data
@Schema(description = "Retrieve password request parameters")
public class RetrievePwdOpRo {

    @Schema(description = "Check type", example = "sms_code")
    private ValidateType type;

    @Schema(description = "Area code（Required for SMS verification code）", example = "+86")
    private String areaCode;

    @Schema(description = "Login Name（Phone number/Email）",
        requiredMode = RequiredMode.REQUIRED, example = "13829291111 ｜ xxx@xx.com")
    private String username;

    @Schema(description = "Phone number/Email Verification Code",
        requiredMode = RequiredMode.REQUIRED, example = "123456")
    private String code;

    @Schema(description = "Password", requiredMode = RequiredMode.REQUIRED,
        example = "qwer1234")
    private String password;

}
