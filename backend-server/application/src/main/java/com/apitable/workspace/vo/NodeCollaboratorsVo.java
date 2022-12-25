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

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.organization.vo.UnitMemberVo;
import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Node collaborator view
 * </p>
 */
@Data
@ApiModel("Node Role Information View")
public class NodeCollaboratorsVo implements Serializable {

    private static final long serialVersionUID = 5137772572237877951L;

    @ApiModelProperty(value = "Current node permission mode", example = "false", position = 1)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean extend;

    @ApiModelProperty(value = "Space administrator list", position = 2)
    private List<UnitMemberVo> admins;

    @ApiModelProperty(value = "Person in charge", position = 3)
    private UnitMemberVo owner;

    @ApiModelProperty(value = "Own", position = 4)
    private UnitMemberVo self;

    @ApiModelProperty(value = "Organization unit list of node role", position = 5)
    private List<NodeRoleUnit> roleUnits;

    @ApiModelProperty(value = "Node Role Member List", position = 6)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<NodeRoleMemberVo> members;

    @ApiModelProperty(value = "Name of the parent node that inherits permissions", position = 7)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String extendNodeName;

    @ApiModelProperty(value = "Whether the node belongs to the root directory", position = 8)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean belongRootFolder;
}
