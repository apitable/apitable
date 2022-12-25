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
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Pattern.Flag;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.constants.PatternConstants;

/**
 * Mailbox verification code request parameters
 */
@Data
@ApiModel("Mailbox verification code request parameters")
public class EmailOpRo {

    @ApiModelProperty(value = "Email", example = "...@apitable.com", position = 1, required = true)
    @NotBlank(message = "Email cannot be empty")
    @Pattern(regexp = PatternConstants.EMAIL, message = "Incorrect email format", flags = Flag.CASE_INSENSITIVE)
    private String email;

    @ApiModelProperty(value = "SMS verification code type", dataType = "java.lang.Integer", example = "1", position = 2, required = true)
    @NotNull(message = "Type cannot be empty")
    private Integer type;
}
