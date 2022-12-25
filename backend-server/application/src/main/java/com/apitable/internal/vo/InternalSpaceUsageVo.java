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

package com.apitable.internal.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.support.serializer.NullNumberSerializer;

/**
 * Space usage information view
 */
@Data
@ApiModel("space usage information view")
public class InternalSpaceUsageVo {

    @ApiModelProperty(value = "The total number of rows in all tables of the space", example = "5", position = 1)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long recordNums;

    @ApiModelProperty(value = "total album views", example = "10", position = 2)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long galleryViewNums;

    @ApiModelProperty(value = "total kanban views", example = "10", position = 3)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long kanbanViewNums;

    @ApiModelProperty(value = "total gantt views", example = "10", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long ganttViewNums;

    @ApiModelProperty(value = "total number of calendar views", example = "10", position = 5)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long calendarViewNums;
}
