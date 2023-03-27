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
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Data;

/**
 * <p>
 * Create Template Request Parameters.
 * </p>
 */
@Data
@Schema(description = "Create Template Request Parameters")
public class CreateTemplateRo {

    @Schema(description = "Template Name", example = "This is a template", required = true)
    @NotBlank(message = "Template name cannot be empty")
    @Size(max = 100, message = "The name length cannot exceed 100 bits")
    private String name;

    @Schema(description = "Node Id of template creation", example = "nod10", required = true)
    @NotBlank(message = "Node Id cannot be empty")
    private String nodeId;

    @Schema(description = "Whether to retain data", example = "true")
    private Boolean data = true;
}
