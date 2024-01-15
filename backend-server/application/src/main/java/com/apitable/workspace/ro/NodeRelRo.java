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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Node Association Request Parameters.
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Node Association Request Parameters")
public class NodeRelRo {

    @Schema(description = "Datasheet ID")
    private String datasheetId;

    @Schema(description = "View ID")
    private String viewId;

    @Schema(description = "View Name")
    private String viewName;

    @Schema(description = "Embed page info", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private NodeEmbedPageRo embedPage;

    public NodeRelRo(String viewId) {
        this.viewId = viewId;
    }
}
