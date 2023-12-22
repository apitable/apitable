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

import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AutomationTaskSimpleVO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Automation Task simple Vo")
public class AutomationTaskSimpleVO {

    @Schema(description = "Robot id", type = "java.lang.String", example = "arb**")
    private String robotId;

    @Schema(description = "Robot run task id", type = "java.lang.String", example = "2222")
    private String taskId;

    @Schema(description = "Robot run at", type = "java.lang.Long", example = "233")
    private Long createdAt;

    @Schema(description = "Robot run status", type = "java.lang.Integer", example = "2")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer status;

    @Schema(description = "Robot run actions", example = "[]")
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<ActionExecutionVO> executedActions;

    /**
     * Automation executed action info.
     */
    @Data
    public static class ActionExecutionVO {
        @Schema(description = "Robot run action id", type = "java.lang.String", example = "arb**")
        private String actionId;

        @Schema(description = "Robot run action type id", type = "java.lang.String", example = "2222")
        private String actionTypeId;

        @Schema(description = "Robot run success", type = "java.lang.Boolean", example = "true")
        private Boolean success;
    }
}
