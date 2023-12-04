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
 * Register operation request parameters.
 */
@Data
@Schema(description = "Register operation request parameters")
public class RegisterOpRo {

    @Schema(description = "Save the token of WeChat union ID and mobile phone number",
        requiredMode = RequiredMode.REQUIRED, example = "thisistoken")
    @NotBlank(message = "Token cannot be empty")
    private String token;

    @Schema(description = "Registration invitation code",
        requiredMode = RequiredMode.REQUIRED, example = "test")
    private String inviteCode;
}
