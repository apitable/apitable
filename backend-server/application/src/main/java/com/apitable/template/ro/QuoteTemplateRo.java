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

package com.apitable.template.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * <p>
 * Reference Template Request Parameters.
 * </p>
 */
@Data
@Schema(description = "Reference Template Request Parameters")
public class QuoteTemplateRo {

    @Schema(description = "Template ID", requiredMode = RequiredMode.REQUIRED,
        example = "tplHTbkg7qbNJ")
    @NotBlank(message = "Template ID cannot be empty")
    private String templateId;

    @Schema(description = "Parent node ID", requiredMode = RequiredMode.REQUIRED,
        example = "fodSf4PZBNwut")
    private String parentId;

    @Schema(description = "Whether to retain data", example = "true")
    private Boolean data = true;

    @Schema(description = "where to quote", example = "23445")
    private String unitId;

}
