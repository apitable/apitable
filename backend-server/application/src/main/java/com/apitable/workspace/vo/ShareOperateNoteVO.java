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
import com.apitable.shared.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * Share operation records
 * </p>
 */
@Data
@ApiModel("Node sharing operation record view")
public class ShareOperateNoteVO {

    @ApiModelProperty(value = "Operator", example = "Zhang San", position = 1)
    private String operator;

    @ApiModelProperty(value = "Denomination of dive", example = "Open｜Close｜Refresh", position = 2)
    private String action;

    @ApiModelProperty(value = "Operation event", example = "Share｜ Allow others to save ｜ Share Link", position = 3)
    private String event;

    @ApiModelProperty(value = "Operation time (UTC timestamp)", example = "2020-03-19T16:03:16.000", position = 4)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime timestamp;
}
