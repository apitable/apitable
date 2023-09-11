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

import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Comparator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * TriggerSimpleVO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TriggerSimpleVO {

    @Schema(description = "Trigger id", type = "java.lang.String", example = "atr***")
    private String triggerId;

    @Schema(description = "Trigger type id", type = "java.lang.String", example = "***")
    private String triggerTypeId;

    @Schema(description = "Trigger type id", type = "java.lang.String", example = "***")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String prevTriggerId;

    public static Comparator<TriggerSimpleVO> triggerComparator = (o1, o2) -> {
        if (null == o1.prevTriggerId) {
            return -1;
        }
        if (null == o2.prevTriggerId) {
            return 1;
        }
        if (o1.triggerId.equals(o2.prevTriggerId)) {
            return -1;
        }
        if (o2.triggerId.equals(o1.prevTriggerId)) {
            return 1;
        }
        return 0;
    };

}
