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

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * DataSheet Operation Request Parameters
 * </p>
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@ApiModel("DataSheet Operation Request Parameters")
public class DatasheetOperationOpRo  {



    @ApiModelProperty(value = "Operation ID", position = 2)
    private String opId;

    @ApiModelProperty(value = "Meter ID", position = 3)
    private String dstId;

    @ApiModelProperty(value = "Operation name", position = 4)
    private String actionName;

    @ApiModelProperty(value = "Collection of operations", position = 5)
    private String actions;

    @ApiModelProperty(value = "Type 1-JOT 2-COT", position = 6)
    private Integer type;

    @ApiModelProperty(value = "Action member ID", position = 7)
    private Long memberId;

    @ApiModelProperty(value = "Version", position = 8)
    private Long revision;


}
