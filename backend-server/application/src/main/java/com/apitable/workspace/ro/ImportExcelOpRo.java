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

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * ImportExcelOpRo
 *
 * @author Chambers
 * @since 2019/11/6
 */
@Data
@ApiModel("Import data table request parameters")
public class ImportExcelOpRo {

    @ApiModelProperty(value = "Parent Node Id", example = "nod10", position = 1, required = true)
    @NotBlank(message = "The parent node ID cannot be empty")
    private String parentId;

    @ApiModelProperty(value = "Import File", position = 3, required = true)
    @NotNull(message = "The import file cannot be empty")
    private MultipartFile file;
}
