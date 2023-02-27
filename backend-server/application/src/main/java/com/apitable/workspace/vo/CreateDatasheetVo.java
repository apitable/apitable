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

package com.apitable.workspace.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

/**
 * Create Datasheet Vo.
 */
@Data
@Schema(description = "Create DataSheet View")
@Builder
public class CreateDatasheetVo {

    @Schema(description = "DataSheet ID", example = "dstfCEKoPjXSJ8jdSj")
    private String datasheetId;

    @Schema(description = "Folder ID", example = "fodn173Q0e8nC")
    private String folderId;

    @Schema(description = "Previous node ID", example = "dstfCEKoPjXSJ8jdSj")
    private String preNodeId;

    @Schema(description = "Create time", example = "24342423342")
    private Long createdAt;

    @JsonIgnoreProperties
    private String nodeId;

    @JsonIgnoreProperties
    private String parentId;

}
