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

package com.apitable.widget.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Widget Information View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Widget Information View")
public class WidgetInfo {

    @ApiModelProperty(value = "Widget ID", example = "wdt123", position = 1)
    private String widgetId;

    @ApiModelProperty(value = "Widget Name", example = "Widget instance name", position = 2)
    private String widgetName;

    @ApiModelProperty(value = "Cover drawing of component package", example = "https://apitable.com/space/2020/12/23/aqa", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String widgetPackageCover;

    @ApiModelProperty(value = "Data source table ID", example = "dst123", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String datasheetId;

    @ApiModelProperty(value = "Data source data table name", example = "wpkABC", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String datasheetName;

    @ApiModelProperty(value = "Package Icon", example = "https://apitable.com/space/2020/12/23/aqa", position = 6)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String widgetPackageIcon;
}
