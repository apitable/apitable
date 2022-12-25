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

import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * User Action Request Parameters
 */
@Data
@ApiModel("User Action Request Parameters")
public class UserOpRo {

    @ApiModelProperty(value = "Avatar", example = "https://...", position = 1)
    private String avatar;

    @ApiModelProperty(value = "default avatar color", example = "1", position = 2)
    private Integer avatarColor;

    @ApiModelProperty(value = "Nickname", example = "This is a nickname", position = 3)
    @Size(max = 32, message = "Nickname length cannot exceed 32 bits")
    private String nickName;

    @ApiModelProperty(value = "Whether it is a registered initialization nickname", example = "true", position = 4)
    private Boolean init;

    @ApiModelProperty(value = "Language", example = "zh-CN", position = 5)
    private String locale;
}
