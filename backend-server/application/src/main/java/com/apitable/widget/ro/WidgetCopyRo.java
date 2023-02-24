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
import java.util.List;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

/**
 * <p>
 * Widget Copy Request Parameters.
 * </p>
 */
@Data
@Schema(description = "Widget Copy Request Parameters")
public class WidgetCopyRo {

    @Schema(description = "Dashboard ID", required = true, example = "dsb11")
    @NotBlank(message = "Dashboard ID cannot be empty")
    private String dashboardId;

    @Schema(description = "Widget ID List", required = true, example = "[\"wdtiJjVmNFcFmNtQFA\", "
        + "\"wdtSbp8TkH7gTGAYR1\"]")
    @NotEmpty(message = "Widget ID list cannot be empty")
    private List<String> widgetIds;
}
