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

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Mobile verification code verification request parameters.
 */
@Data
@Schema(description = "Mobile phone verification code verification request parameters")
public class SmsCodeValidateRo {

    @NotBlank(message = "Mobile phone area code cannot be empty")
    @Schema(description = "Area code", requiredMode = RequiredMode.REQUIRED, example = "+86")
    private String areaCode;

    @Schema(description = "Phone number", requiredMode = RequiredMode.REQUIRED,
        example = "13411112222")
    @NotBlank(message = "Mobile number cannot be empty")
    private String phone;

    @Schema(description = "Mobile phone verification code",
        requiredMode = RequiredMode.REQUIRED, example = "123456")
    @NotBlank(message = "The verification code cannot be empty")
    private String code;
}
