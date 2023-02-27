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

package com.apitable.organization.vo;

import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Department information.
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@Schema(description = "Department information")
public class TeamInfoVo {

    @Schema(description = "Department ID", type = "java.lang.String", example = "1")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @Schema(description = "Department name", example = "R&D Department")
    private String teamName;

    @Schema(description = "Parent ID, 0 if the parent is root", type = "java.lang.String",
        example = "0")
    @JsonSerialize(using = ToStringSerializer.class)
    private Long parentId;

    @Schema(description = "Parent department name", example = "Scientific Research Center")
    private String parentTeamName;

    @Schema(description = "Number of department members", example = "3")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer memberCount;

    @Schema(description = "Number of activated department members", example = "3")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer activateMemberCount;

    @Schema(description = "Sort No", example = "1")
    private Integer sequence;

    @Schema(description = "Whether there are sub departments", example = "true")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasChildren;
}
