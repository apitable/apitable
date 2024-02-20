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
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * ImportExcelOpRo.
 *
 * @author Chambers
 * @since 2019/11/6
 */
@Data
@Schema(description = "Import data table request parameters")
public class ImportExcelOpRo {

    @Schema(description = "Parent Node Id",
        requiredMode = RequiredMode.REQUIRED, example = "nod10")
    @NotBlank(message = "The parent node ID cannot be empty")
    private String parentId;

    @Schema(description = "Import File", requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "The import file cannot be empty")
    private MultipartFile file;

    @Schema(description = "View Name", example = "nod10")
    private String viewName;

    @Schema(description = "Unit id", example = "234566")
    private String unitId;
}
