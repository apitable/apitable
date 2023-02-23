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

/**
 * Login Request Parameters
 *
 * @author Chambers
 */
@Data
@ApiModel("Authorization Sign Up Request Parameters")
public class RegisterRO {

    @ApiModelProperty(value = "Username(email/telephone...)",
        example = "xxxx@apitable.com", position = 1, required = true)
    private String username;

    @ApiModelProperty(value = "Credential(password/verify code...)",
        example = "qwer1234 || 261527", position = 2, required = true)
    private String credential;
}
