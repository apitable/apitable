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

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;

/**
 * <p>
 * Department information
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Department information")
public class TeamInfoVo {

    @ApiModelProperty(value = "Department ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @ApiModelProperty(value = "Department name", example = "R&D Department", position = 2)
    private String teamName;

    @ApiModelProperty(value = "Parent ID, 0 if the parent is root", dataType = "java.lang.String", example = "0", position = 3)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long parentId;

    @ApiModelProperty(value = "Parent department name", example = "Scientific Research Center", position = 3)
    private String parentTeamName;

    @ApiModelProperty(value = "Number of department members", example = "3", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer memberCount;

    @ApiModelProperty(value = "Number of activated department members", example = "3", position = 5)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer activateMemberCount;

    @ApiModelProperty(value = "Sort No", example = "1", position = 6)
    private Integer sequence;

    @ApiModelProperty(value = "Whether there are sub departments", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasChildren;
}
