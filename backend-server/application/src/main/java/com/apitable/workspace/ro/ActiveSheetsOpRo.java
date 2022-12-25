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

package com.apitable.workspace.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Active node request parameters
 * </p>
 */
@Data
@ApiModel("Active node request parameters")
public class ActiveSheetsOpRo {

    @ApiModelProperty(value = "Active node id", example = "dst15", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "View ID of active number table", example = "views135", position = 2)
    private String viewId;

    @ApiModelProperty(value = "Location (0: working directory; 1: star)", example = "1", position = 3)
    private Integer position;

}
