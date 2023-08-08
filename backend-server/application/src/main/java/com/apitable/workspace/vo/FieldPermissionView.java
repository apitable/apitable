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

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Field Permission View.
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Field Permission View")
public class FieldPermissionView {

    @Schema(description = "Node ID", example = "dstGxznHFXf9pvF1LZ")
    private String nodeId;

    @Schema(description = "Datasheet ID（Node ID / Source Datasheet node ID）",
        example = "dstGxznHFXf9pvF1LZ")
    private String datasheetId;

    @Schema(description = "Datasheet field permission information", type = "java.util.Map")
    private Map<String, FieldPermissionInfo> fieldPermissionMap;
}
