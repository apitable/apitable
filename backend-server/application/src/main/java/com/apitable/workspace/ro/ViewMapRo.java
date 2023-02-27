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
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * DataSheet View Parameters.
 * </p>
 */
@Schema(description = "DataSheet View Map Parameter")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class ViewMapRo {

    @Schema(description = "Custom View ID")
    private String id;

    @Schema(description = "View Name")
    private String name;

    @Schema(description = "View「row」")
    private JSONArray rows;

    @Schema(description = "View「columns」")
    private JSONArray columns;

    @Schema(description = "View Properties")
    private String property;

    @Schema(description = "View Type 1-DataSheet「Grid」")
    private Integer type;

    @Schema(description = "View Description")
    private String description;

    @Schema(description = "The number of frozen view columns, starting from the first column, is "
        + "1 by default")
    private Integer frozenColumnCount;

    @Schema(description = "View Hide Options")
    private Boolean hidden;

    @Schema(description = "Filter Items")
    private JSONObject filterInfo;

    @Schema(description = "Sort")
    private JSONArray sortInfo;

    @Schema(description = "Row height")
    private Integer rowHeightLevel;

    @Schema(description = "Group")
    private JSONArray groupInfo;

    @Schema(description = "Album View Style")
    private JSONObject style;
}
