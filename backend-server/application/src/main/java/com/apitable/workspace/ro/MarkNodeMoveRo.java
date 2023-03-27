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
import javax.validation.constraints.NotBlank;
import lombok.Data;

/**
 * <p>
 * Star mark node move request parameters.
 * </p>
 */
@Data
@Schema(description = "Star mark node move request parameters")
public class MarkNodeMoveRo {

    @Schema(description = "Node Id", example = "nod10", required = true)
    @NotBlank(message = "Node Id cannot be empty")
    private String nodeId;

    @Schema(description = "The previous node of the target position moves to the first position "
        + "when it is empty", example = "nod10")
    private String preNodeId;
}
