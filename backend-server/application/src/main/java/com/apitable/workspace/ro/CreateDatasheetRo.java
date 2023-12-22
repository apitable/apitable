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

import cn.hutool.core.util.StrUtil;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Node Request Parameters.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Node Request Parameters")
public class CreateDatasheetRo {

    @Schema(description = "Name", example = "This is a node", required = true)
    @Size(max = 100, message = "The name length cannot exceed 100 bits")
    private String name;

    @Schema(description = "Parent Node Id", example = "nod10")
    @NotBlank(message = "The parent node ID cannot be empty")
    private String folderId;

    @Schema(description = "The previous node of the target position moves to the first position "
        + "when it is empty", example = "nod10")
    private String preNodeId;

    @Schema(description = "Description", example = "This is a table")
    private String description;

    /**
     * Transfer To NodeOpRo.
     */
    public NodeOpRo tranferToNodeOpRo() {
        return NodeOpRo.builder()
            .nodeName(this.name)
            .type(2)
            .parentId(this.folderId)
            .preNodeId(this.preNodeId)
            .build();
    }

    public boolean needToInsertDesc() {
        return StrUtil.isNotBlank(this.description);
    }

}
