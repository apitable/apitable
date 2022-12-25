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

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * DataSheet field request parameters
 * </p>
 */
@ApiModel("DataSheet field request parameters")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class FieldMapRo {

    @ApiModelProperty(value = "Field Custom Id", position = 2)
    private String id;

    @ApiModelProperty(value = "Field Name", position = 3)
    private String name;

    @ApiModelProperty(value = "Describe", position = 4)
    private String desc;

    @ApiModelProperty(value = "Field Type 1-Text「Text」2-Number「NUMBER」 3-Single choice 「SINGLESELECT」4-Multiple choice「MULTISELECT」 5-Date「DATETIME」 6-Enclosure「ATTACHMENT」 7-Relation「LINK」", position = 5)
    private Integer type;

    @ApiModelProperty(value = "Attribute", position = 6)
    private JSONObject property;

    @ApiModelProperty(value = "Set as required in the form", position = 7)
    private Boolean required;
}
