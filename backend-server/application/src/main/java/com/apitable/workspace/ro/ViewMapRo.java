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

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * DataSheet View Parameters
 * </p>
 */
@ApiModel("DataSheet View Map Parameter")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class ViewMapRo {

    @ApiModelProperty(value = "Custom View ID",position = 1)
    private String id;

    @ApiModelProperty(value = "View Name", position = 2)
    private String name;

    @ApiModelProperty(value = "View「row」", position = 3)
    private JSONArray rows;

    @ApiModelProperty(value = "View「columns」", position = 4)
    private JSONArray columns;

    @ApiModelProperty(value = "View Properties", position = 5)
    private String property;

    @ApiModelProperty(value = "View Type 1-DataSheet「Grid」", position = 6)
    private Integer type;

    @ApiModelProperty(value = "View Description", position = 7)
    private String description;

    @ApiModelProperty(value = "The number of frozen view columns, starting from the first column, is 1 by default", position = 7)
    private Integer frozenColumnCount;

    @ApiModelProperty(value = "View Hide Options", position = 8)
    private Boolean hidden;

    @ApiModelProperty(value = "Filter Items", position = 9)
    private JSONObject filterInfo;

    @ApiModelProperty(value = "Sort", position = 11)
    private JSONArray sortInfo;

    @ApiModelProperty(value = "Row height", position = 12)
    private Integer rowHeightLevel;

    @ApiModelProperty(value = "Group", position = 13)
    private JSONArray groupInfo;

    @ApiModelProperty(value = "Album View Style", position = 14)
    private JSONObject style;
}
