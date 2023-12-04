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
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Org Unit and Record Request Parameters.
 * </p>
 */
@Data
@Schema(description = "Org Unit and Record Request Parameters")
public class RemindUnitRecRo {

    @Schema(description = "Record ID List", example = "[\"rec037CbsaKcN\",\"recFa9VgsXMrS\"]")
    private List<String> recordIds;

    @Schema(description = "Org Unit ID List", requiredMode = RequiredMode.REQUIRED,
        example = "[1217029304827183105,1217029304827183106]")
    @NotEmpty(message = "The organizational unit list cannot be empty")
    private List<Long> unitIds;

    @Schema(description = "Record Title", example = "This is a record")
    private String recordTitle;

    @Schema(description = "Column name", example = "This is a column name")
    private String fieldName;
}
