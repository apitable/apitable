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

package com.apitable.user.vo;

import cn.hutool.json.JSONObject;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.apitable.shared.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * Integral Revenue&Expense Record View
 * </p>
 */
@Data
@ApiModel("Integral Revenue&Expense Record View")
public class IntegralRecordVO {

    @ApiModelProperty(value = "Action ID", example = "invitation_reward", position = 1)
    private String action;

    @ApiModelProperty(value = "Change Type (0: Revenue, 1: Expense)", example = "0", position = 2)
    private Integer alterType;

    @ApiModelProperty(value = "Change value (unit: minutes)", example = "1000", position = 3)
    private String alterValue;

    @ApiModelProperty(value = "Parameter", position = 4)
    private JSONObject params;

    @ApiModelProperty(value = "Change time", example = "1000", position = 5)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;
}
