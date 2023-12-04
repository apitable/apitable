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

package com.apitable.asset.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * <p>
 * Image audit result request parameters.
 * </p>
 */
@Data
@Schema(description = "Image audit result request parameters")
public class AttachAuditScenesResultRo {

    @Schema(description = "The status code 0 is successful, 1 is waiting for processing, 2 is "
        + "processing, 3 processing failed, and 4 notification submission failed.",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "Processing queue name")
    private String code;

    @Schema(description = "Message Results", requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "Message Results")
    private String message;

    @Schema(description = "The status code 0 is successful, 1 is waiting for processing, 2 is "
        + "processing, 3 processing failed, and 4 notification submission failed.",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "Processing queue name")
    private AttachAuditScenesRo scenes;

    @Schema(description = "Processing queue name", requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "Processing queue name")
    private String suggestion;

}
