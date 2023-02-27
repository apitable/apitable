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

package com.apitable.organization.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Resolution Failure Details View.
 * </p>
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Resolution Failure Details View")
public class ParseErrorRecordVO {

    @Deprecated
    @Schema(description = "Number of rows", example = "Line 6")
    private String rowIndex;

    @Schema(description = "Row index", example = "1")
    private Integer rowNumber;

    @Schema(description = "Member nickname", example = "Zhang San")
    private String name;

    @Schema(description = "Email", example = "Line 6")
    private String email;

    @Schema(description = "Number of rows", example = "Line 6")
    private String team;

    @Schema(description = "Error Details", example = "Email not filled")
    private String message;
}
