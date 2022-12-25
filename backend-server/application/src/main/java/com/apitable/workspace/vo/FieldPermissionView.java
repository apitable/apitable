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

import java.util.Map;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Field Permission View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Field Permission View")
public class FieldPermissionView {

    @ApiModelProperty(value = "Node ID", example = "dstGxznHFXf9pvF1LZ")
    private String nodeId;

    @ApiModelProperty(value = "Datasheet ID（Node ID / Source Datasheet node ID）", example = "dstGxznHFXf9pvF1LZ", position = 1)
    private String datasheetId;

    @ApiModelProperty(value = "Datasheet field permission information", dataType = "java.util.Map", position = 2)
    private Map<String, FieldPermissionInfo> fieldPermissionMap;
}
