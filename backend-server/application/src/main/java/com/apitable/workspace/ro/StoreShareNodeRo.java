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

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * <p>
 * Transfer sharing node request parameters.
 * </p>
 */
@Data
@Schema(description = "Transfer sharing node request parameters")
public class StoreShareNodeRo {

    @NotBlank(message = "Space ID cannot be empty")
    @Schema(description = "Space ID", example = "spc20cjiwis2")
    private String spaceId;

    @NotBlank(message = "The share ID cannot be empty")
    @Schema(description = "Share ID", example = "shrSJ921CNsj")
    private String shareId;
}
