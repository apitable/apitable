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

package com.apitable.automation.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * Automation run history request object.
 */
@Data
@Schema(description = "Automation run history request parameters")
public class AutomationRunHistoryRo {

    @Schema(description = "Robot id", example = "arb***", requiredMode = Schema.RequiredMode.REQUIRED)
    private String robotId;

    @Schema(description = "Current page number, default: 1", example = "1", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private Integer pageNum = 1;

    @Schema(description = "Page size, default: 20", example = "20", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private Integer pageSize = 20;
}
