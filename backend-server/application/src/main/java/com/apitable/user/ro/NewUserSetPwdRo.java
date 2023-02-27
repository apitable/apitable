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
import lombok.Data;

/**
 * New user sets password request parameters.
 */
@Data
@Schema(description = "New user sets password request parameters")
public class NewUserSetPwdRo {

    @Schema(description = "Phone number", example = "135...", required = true)
    private String phone;

    @Schema(description = "New password", example = "qwer1234", required = true)
    private String newPassword;

    @Schema(description = "Confirm Password", example = "qwer1234", required = true)
    private String confirmPassword;
}
