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
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * <p>
 * Attachment URL Request Parameters.
 * </p>
 */
@Data
@Schema(description = "Attachment Request Parameters")
public class AttachUrlOpRo {

    @Schema(description = "URL of uploaded file", requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "File URL cannot be empty")
    private String url;

    @Schema(description = "Type (0: user profile 1: space logo 2: data table attachment)",
        example = "0", requiredMode = RequiredMode.REQUIRED)
    @NotNull(message = "Type cannot be empty")
    @Max(value = 2, message = "ERROR IN TYPE")
    private Integer type;

    @Schema(description = "Data meter node Id (data meter attachment must be transferred)",
        example = "dst10")
    private String nodeId;
}
