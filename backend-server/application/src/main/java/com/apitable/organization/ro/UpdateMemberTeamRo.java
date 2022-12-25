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

package com.apitable.organization.ro;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.apitable.core.support.deserializer.StringArrayToLongArrayDeserializer;
import com.apitable.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Adjust member department request parameters
 */
@Data
@ApiModel("Adjust member department request parameters")
public class UpdateMemberTeamRo {

    @NotEmpty
    @ApiModelProperty(value = "Member ID", required = true, dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 1)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> memberIds;

    @ApiModelProperty(value = "The original department ID list can be blank. If it is blank, it means the root department", dataType = "java.lang.String", example = "271632", position = 2)
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long preTeamId;

    @NotEmpty
    @ApiModelProperty(value = "Adjusted Department ID List", required = true, dataType = "List", example = "[\"10101\",\"10102\",\"10103\",\"10104\"]", position = 3)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> newTeamIds;
}
