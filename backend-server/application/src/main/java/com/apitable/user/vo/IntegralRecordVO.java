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
import com.apitable.shared.support.serializer.LocalDateTimeToMilliSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * Integral Revenue&Expense Record View.
 * </p>
 */
@Data
@ApiModel("Integral Revenue&Expense Record View")
public class IntegralRecordVO {

    /**
     * Action ID.
     */
    @ApiModelProperty(value = "Action ID",
        example = "invitation_reward")
    private String action;

    /**
     * Alter type.
     */
    @ApiModelProperty(value = "Change Type (0: Revenue, 1: Expense)",
        example = "0")
    private Integer alterType;

    /**
     * Alter Value.
     */
    @ApiModelProperty(value = "Change value (unit: minutes)",
        example = "1000")
    private String alterValue;

    /**
     * Parameter.
     */
    @ApiModelProperty(value = "Parameter")
    private JSONObject params;

    /**
     * Create Time.
     */
    @ApiModelProperty(value = "Change time(millisecond)",
        example = "1573561644000")
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class)
    private LocalDateTime createdAt;
}
