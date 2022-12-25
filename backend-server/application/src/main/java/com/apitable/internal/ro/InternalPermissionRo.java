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

package com.apitable.internal.ro;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Internal Interface - Permission Request Parameters")
public class InternalPermissionRo {

    @ApiModelProperty(value = "Node ID list", required = true, example = "[\"fomtujwf5eSWKiMaVw\",\"dstbw4CZFURbchgP17\"]", position = 1)
    @NotEmpty(message = "Node ID list cannot be empty")
    private List<String> nodeIds;

    @ApiModelProperty(value = "Node Share Id", dataType = "java.lang.String", example = "shr8T8vAfehg3yj3McmDG", position = 2)
    private String shareId;

    @ApiModelProperty(value = "User Id", dataType = "java.lang.String", example = "usrddddd", position = 3)
    private String userId;
}
