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
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * <p>
 * Request parameters for widget creation.
 * </p>
 */
@Data
@Schema(description = "Request parameters for widget creation")
public class WidgetCreateRo {

    @Schema(description = "Node ID", requiredMode = RequiredMode.REQUIRED,
        example = "dstAAA/dsbBBB")
    @NotBlank(message = "Node ID cannot be empty")
    private String nodeId;

    @Schema(description = "Widget Package ID",
        requiredMode = RequiredMode.REQUIRED, example = "wpkBBB")
    @NotBlank(message = "The Widget package ID cannot be empty")
    private String widgetPackageId;

    @Schema(description = "Widget name", example = "This is a widget")
    private String name = "New Widget";
}
