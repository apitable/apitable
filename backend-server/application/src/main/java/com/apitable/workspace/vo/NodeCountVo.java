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

package com.apitable.workspace.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Number of nodes vo
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Number of nodes vo")
public class NodeCountVo {

    @ApiModelProperty(value = "Number of folders", example = "5", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer folderNumber;

    @ApiModelProperty(value = "Number of documents", example = "20", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer fileNumber;

}
