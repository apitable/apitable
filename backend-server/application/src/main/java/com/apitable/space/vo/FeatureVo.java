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

package com.apitable.space.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Internal test function status value object
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Internal test function status")
public class FeatureVo {

    @ApiModelProperty(value = "Unique identification of laboratory function", dataType = "java.lang.String", example = "robot", position = 1)
    private String key;

    @ApiModelProperty(value = "Laboratory function category", dataType = "java.lang.String", example = "review", position = 2)
    private String type;

    @ApiModelProperty(value = "Laboratory function application internal test form url", dataType = "java.lang.String", position = 3)
    private String url;

    @ApiModelProperty(value = "Laboratory function opening status", dataType = "java.lang.Boolean", example = "true", position = 4)
    private Boolean open;
}
