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
public class AttachAuditItemsRo {


    @Schema(description = "Operation instructions for processing file results",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "Operation instructions for processing file results")
    private String cmd;

    @Schema(description = "Operation status code of processing file results",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "Operation status code of processing file results")
    private String code;

    @Schema(description = "Operation description of processing file results",
        requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "Operation description of processing file results")
    private String desc;

    @Schema(description = "Results of processing files", requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "Results of processing files")
    private AttachAuditResultDisableRo result;

}
