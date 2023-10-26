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

package com.apitable.automation.model;

import com.apitable.shared.support.serializer.IntegerToBooleanSerializer;
import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 * AutomationSimpleVO.
 */
@Data
@Builder(toBuilder = true)
@Schema(description = "Automation Vo")
public class AutomationSimpleVO {

    @Schema(description = "Robot id", type = "java.lang.String", example = "arb**")
    private String robotId;

    @Schema(description = "Robot name", type = "java.lang.String", example = "test")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String name;

    @Schema(description = "Robot description", type = "java.lang.String", example = "test")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String description;

    @Schema(description = "Robot resource id", type = "java.lang.String", example = "test")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String resourceId;

    @Schema(description = "Weather the robot is on use", type = "java.lang.Boolean", example = "true")
    @JsonSerialize(using = IntegerToBooleanSerializer.class)
    private Integer isActive;

    @Schema(description = "Automation triggers list")
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<TriggerSimpleVO> triggers;

    @Schema(description = "Automation actions list")
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<ActionSimpleVO> actions;

    /**
     * AutomationPropertyVO.
     */
    @Data
    @Builder(toBuilder = true)
    public static class AutomationPropertyVO {

        @Schema(description = "Automation actions list")
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean failureNotifyEnable;
    }

    @Schema(description = "Automation run num is over limit")
    private Boolean isOverLimit;
}
