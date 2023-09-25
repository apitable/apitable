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

import com.apitable.shared.support.serializer.NullObjectSerializer;
import com.apitable.shared.support.serializer.StringToJsonObjectSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * TriggerSimpleVO.
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TriggerVO extends TriggerSimpleVO {

    @Schema(description = "Trigger input", type = "java.lang.String", example = "{}")
    @JsonSerialize(nullsUsing = NullObjectSerializer.class, using = StringToJsonObjectSerializer.class)
    private String input;

    @Schema(description = "Trigger resource id", type = "java.lang.String", example = "dst***")
    private String relatedResourceId;
}
