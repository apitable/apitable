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

import java.util.HashMap;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Widget snapshot information (alignment with front-end structure requirements)
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Widget snapshot information")
@Builder(toBuilder = true)
public class WidgetSnapshot {

    @ApiModelProperty(value = "Widget Name", example = "Widget instance name", position = 1)
    private String widgetName;

    @ApiModelProperty(value = "Data source table ID", example = "dst123", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String datasheetId;

    @ApiModelProperty(value = "Storage configuration", position = 3)
    private HashMap<Object,Object> storage;

    @ApiModelProperty(value = "Data source reference source ID", example = "mir123", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String sourceId;
}
