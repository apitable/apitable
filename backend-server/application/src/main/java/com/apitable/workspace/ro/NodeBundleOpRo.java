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

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 * Bundle request parameters
 * </p>
 */
@Data
@ApiModel("Bundle request parameters")
public class NodeBundleOpRo {

    @ApiModelProperty(value = "Upload files", position = 1, required = true)
    @NotNull(message = "File cannot be empty")
    private MultipartFile file;

    @ApiModelProperty(value = "Parent class node ID", example = "fodSf4PZBNwut", position = 2)
    private String parentId;

    @ApiModelProperty(value = "Predecessor node ID", example = "nod10", position = 3)
    private String preNodeId;

    @ApiModelProperty(value = "Password", example = "***", position = 4)
    private String password;
}
