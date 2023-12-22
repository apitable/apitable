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

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * <p>
 * Get the widget store list parameter.
 * </p>
 */
@Data
@Schema(description = "Widget Store List Please Parameter")
public class WidgetStoreListRo {

    @Schema(description = "Whether to filter unpublished widget (true: filter, false: not filter)",
        example = "false")
    private Boolean filter;

    @NotNull
    @Schema(description = "Get widget type (0: space station, 1: global, 10: to be approved)",
        example = "1")
    private Integer type;

    @Schema(description = "Specify the return language", example = "en-US", hidden = true)
    private String language;

    @Schema(description = "Global widget search keywords to be audited")
    private String previewSearchKeyword;

}
