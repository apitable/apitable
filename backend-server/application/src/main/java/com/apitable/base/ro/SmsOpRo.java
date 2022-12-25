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

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * Mobile verification code request parameters
 */
@Data
@ApiModel("Mobile verification code request parameters")
public class SmsOpRo {

    @ApiModelProperty(value = "Area code", example = "+86", position = 1, required = true)
    private String areaCode;

    @ApiModelProperty(value = "cell-phone number", example = "131...", position = 1, required = true)
    @NotBlank(message = "Mobile number cannot be empty")
    private String phone;

    @ApiModelProperty(value = "SMS verification code type", dataType = "java.lang.Integer", example = "1", position = 2, required = true)
    @NotNull(message = "Type cannot be empty")
    private Integer type;

    @ApiModelProperty(value = "Man machine verification, the front end obtains the value of get NVC Val function", example = "BornForFuture", position = 3)
    private String data;
}
