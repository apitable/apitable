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

package com.apitable.space.ro;

import com.apitable.core.support.deserializer.StringToLongDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * <p>
 * Space public invitation link request parameters.
 * </p>
 */
@Data
@Schema(description = "Space public invitation link request parameters")
public class SpaceLinkOpRo {

    @NotNull(message = "Department ID cannot be empty")
    @Schema(description = "Department ID", requiredMode = RequiredMode.REQUIRED,
        type = "java.lang.String", example = "1254")
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;

    @Schema(description = "nodeId", type = "java.lang.String", example = "dst***")
    private String nodeId;
}
