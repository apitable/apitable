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

package com.apitable.workspace.vo;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;

/**
 * <p>
 * Data Table Field Role Information View
 * </p>
 */
@Data
@ApiModel("Data Table Field Permission View")
public class FieldCollaboratorVO {

    @ApiModelProperty(value = "Whether to open", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean enabled;

    @ApiModelProperty(value = "Role Member List", position = 3)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<FieldRoleMemberVo> members;

    @ApiModelProperty(value = "Role Org Unit List", position = 4)
    private List<FieldRole> roles;

    @ApiModelProperty(value = "Data Table Field Role Configuration Attribute", position = 5)
    private FieldRoleSetting setting;
}
