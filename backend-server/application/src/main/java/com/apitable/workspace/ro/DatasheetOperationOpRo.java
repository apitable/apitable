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
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * DataSheet Operation Request Parameters.
 * </p>
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Schema(description = "DataSheet Operation Request Parameters")
public class DatasheetOperationOpRo {


    @Schema(description = "Operation ID")
    private String opId;

    @Schema(description = "Meter ID")
    private String dstId;

    @Schema(description = "Operation name")
    private String actionName;

    @Schema(description = "Collection of operations")
    private String actions;

    @Schema(description = "Type 1-JOT 2-COT")
    private Integer type;

    @Schema(description = "Action member ID")
    private Long memberId;

    @Schema(description = "Version")
    private Long revision;


}
