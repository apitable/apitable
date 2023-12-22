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

package com.apitable.internal.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Data;

/**
 * Internal Permission Ro.
 */
@Data
@Schema(description = "Internal Interface - Permission Request Parameters")
public class InternalPermissionRo {

    @Schema(description = "Node ID list", required = true, example = "[\"fomtujwf5eSWKiMaVw\","
        + "\"dstbw4CZFURbchgP17\"]")
    @NotEmpty(message = "Node ID list cannot be empty")
    private List<String> nodeIds;

    @Schema(description = "Node Share Id", type = "java.lang.String", example =
        "shr8T8vAfehg3yj3McmDG")
    private String shareId;

    @Schema(description = "User Id", type = "java.lang.String", example = "usrddddd")
    private String userId;
}
