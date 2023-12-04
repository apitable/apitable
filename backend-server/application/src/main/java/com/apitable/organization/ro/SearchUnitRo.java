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

package com.apitable.organization.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * <p>
 * Search Org Unit Request Parameters.
 * </p>
 */
@Data
@Schema(description = "Search Org Unit Request Parameters")
public class SearchUnitRo {

    @Schema(description = "Name List",
        requiredMode = RequiredMode.REQUIRED, example = "Zhang San, Li Si")
    @NotBlank(message = "Name list cannot be empty")
    private String names;

    @Schema(description = "Association ID: node sharing ID, template ID", type = "java.lang"
        + ".String", example = "shr8T8vAfehg3yj3McmDG")
    private String linkId;
}
