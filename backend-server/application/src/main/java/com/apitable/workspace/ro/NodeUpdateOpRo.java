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

import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

/**
 * Node Edit Request Parameters
 */
@Data
@ApiModel("Node Edit Request Parameters")
public class NodeUpdateOpRo {

    @ApiModelProperty(value = "Name", example = "This is a new node name", position = 1)
    @Size(max = 100, message = "The name length cannot exceed 100 bits")
    private String nodeName;

    @ApiModelProperty(value = "Icon", example = ":smile", position = 2)
    private String icon;

    @ApiModelProperty(value = "Cover, Empty（'null' OR 'undefined'）", example = "space/2020/5/19/..", position = 3)
    private String cover;

    @ApiModelProperty(value = "Whether to display the recorded history", example = "1", position = 4)
    @Range(min = 0, max = 1, message = "Display record history can only be 0/1")
    private Integer showRecordHistory;
}
