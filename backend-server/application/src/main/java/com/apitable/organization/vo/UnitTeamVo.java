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
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Department Unit View
 * </p>
 */
@Data
@ApiModel("Department Unit View")
public class UnitTeamVo {

    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "Group ID", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long teamId;

    @ApiModelProperty(value = "Group name", example = "R&D Department ｜ Zhang San", position = 3)
    private String teamName;

    @ApiModelProperty(value = "Department name (not highlighted)", example = "Technical team", position = 3)
    private String originName;

    @ApiModelProperty(value = "Number of members", example = "3", position = 5)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer memberCount;

    @ApiModelProperty(value = "Whether there are sub departments and members", example = "true", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasChildren;

    @ApiModelProperty(value = "Whether there are sub departments", example = "true", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean hasChildrenTeam;
}
