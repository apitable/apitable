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

package com.apitable.widget.ro;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Request parameters for widget creation
 * </p>
 */
@Data
@ApiModel("Request parameters for widget creation")
public class WidgetCreateRo {

    @ApiModelProperty(value = "Node ID", required = true, example = "dstAAA/dsbBBB", position = 1)
    @NotBlank(message = "Node ID cannot be empty")
    private String nodeId;

    @ApiModelProperty(value = "Widget Package ID", required = true, example = "wpkBBB", position = 2)
    @NotBlank(message = "The Widget package ID cannot be empty")
    private String widgetPackageId;

    @ApiModelProperty(value = "Widget name", example = "This is a widget", position = 3)
    private String name = "New Widget";
}
