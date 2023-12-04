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

package com.apitable.organization.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Add tag request parameters.
 */
@Data
@Schema(description = "Add tag request parameters")
public class CreateTagRo {

    @NotNull(message = "Space ID cannot be empty")
    @Schema(description = "Space unique ID", example = "r4Arzo4YydiwsgAV",
        requiredMode = RequiredMode.REQUIRED)
    private String spaceId;

    @NotBlank
    @Size(min = 1, max = 100, message = "Limit 1 to 100 characters and input special characters")
    @Schema(description = "Label Name", type = "string", example = "New label",
        requiredMode = RequiredMode.REQUIRED)
    private String tagName;
}
