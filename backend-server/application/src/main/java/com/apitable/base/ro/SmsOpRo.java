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

package com.apitable.base.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;

/**
 * Mobile verification code request parameters.
 */
@Data
@Schema(description = "Mobile verification code request parameters")
public class SmsOpRo {

    @Schema(description = "Area code", example = "+86", required = true)
    private String areaCode;

    @Schema(description = "cell-phone number", example = "131...", required = true)
    @NotBlank(message = "Mobile number cannot be empty")
    private String phone;

    @Schema(description = "SMS verification code type", type = "java.lang.Integer", example = "1",
        required = true)
    @NotNull(message = "Type cannot be empty")
    private Integer type;

    @Schema(description = "Man machine verification, the front end obtains the value of get NVC "
        + "Val function", example = "BornForFuture")
    private String data;
}
