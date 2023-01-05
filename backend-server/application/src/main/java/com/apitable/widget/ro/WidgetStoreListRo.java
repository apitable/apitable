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

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Get the widget store list parameter
 * </p>
 */
@Data
@ApiModel("Widget Store List Please Parameter")
public class WidgetStoreListRo {

    @ApiModelProperty(value = "Whether to filter unpublished widget (true: filter, false: not filter)", example = "false", position = 1)
    private Boolean filter;

    @NotNull
    @ApiModelProperty(value = "Get widget type (0: space station, 1: global, 10: to be approved)", example = "1", position = 2)
    private Integer type;

    @ApiModelProperty(value = "Specify the return language", example = "en-US", position = 3, hidden = true)
    private String language;

    @ApiModelProperty(value = "Global widget search keywords to be audited", position = 4)
    private String previewSearchKeyword;

}
