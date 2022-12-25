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

import java.util.List;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Org Unit and Record Request Parameters
 * </p>
 */
@Data
@ApiModel("Org Unit and Record Request Parameters")
public class RemindUnitRecRo {

    @ApiModelProperty(value = "Record ID List", example = "[\"rec037CbsaKcN\",\"recFa9VgsXMrS\"]", position = 1)
    private List<String> recordIds;

    @ApiModelProperty(value = "Org Unit ID List", example = "[1217029304827183105,1217029304827183106]", position = 2, required = true)
    @NotEmpty(message = "The organizational unit list cannot be empty")
    private List<Long> unitIds;

    @ApiModelProperty(value = "Record Title", example = "This is a record", position = 3)
    private String recordTitle;

    @ApiModelProperty(value = "Column name", example = "This is a column name", position = 4)
    private String fieldName;
}
