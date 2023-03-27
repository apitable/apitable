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

import com.apitable.core.support.deserializer.StringArrayToLongArrayDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

/**
 * <p>
 * Add node role request parameters.
 * </p>
 */
@Data
@Schema(description = "Add node role request parameters")
public class AddNodeRoleRo {

    @NotBlank(message = "Node ID cannot be empty")
    @Schema(description = "Node ID", example = "nod10")
    private String nodeId;

    @NotEmpty(message = "Organization unit cannot be empty")
    @Schema(description = "Organization Unit ID Collection", type = "List", example =
        "[\"10101\",\"10102\",\"10103\",\"10104\"]", required = true)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> unitIds;

    @Schema(description = "Role", example = "editor", required = true)
    @NotBlank(message = "Role cannot be empty")
    private String role;
}
