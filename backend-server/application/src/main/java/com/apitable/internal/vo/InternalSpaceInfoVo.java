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

import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullObjectSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * space information.
 */
@Data
@Schema(description = "space information")
public class InternalSpaceInfoVo {

    @Schema(description = "space id", example = "spc***")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String spaceId;

    @Schema(description = "space labs", example = "{}")
    @JsonSerialize(nullsUsing = NullObjectSerializer.class)
    private SpaceLabs labs;

    /**
     * space labs features.
     */
    @Data
    public static class SpaceLabs {
        @Schema(description = "view manual save", example = "false")
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean viewManualSave;

        @Schema(description = "robot", example = "false")
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean robot;
    }

}
