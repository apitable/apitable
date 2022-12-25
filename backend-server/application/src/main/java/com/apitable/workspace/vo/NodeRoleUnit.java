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
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.organization.vo.MemberTeamPathInfo;
import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Organization unit of the node role
 * </p>
 */
@Data
@ApiModel("Organization unit of the node role")
public class NodeRoleUnit {

    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "Organization Unit Name", example = "R&D Department ｜ Zhang San", position = 2)
    private String unitName;

    @ApiModelProperty(value = "Type: 1-Department, 2-Label, 3-Member", example = "1", position = 3)
    private Integer unitType;

    @ApiModelProperty(value = "The number of members of the department. It is returned when the type is department", example = "3", position = 4)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer memberCount;

    @ApiModelProperty(value = "Head portrait, returned when the type is member", example = "http://www.apitable.com/image.png", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "Department, returned when the type is member", example = "Operation Department | Product Department | R&D Department", position = 6)
    private String teams;

    @ApiModelProperty(value = "Role", example = "manager", position = 7)
    private String role;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 8)
    private List<MemberTeamPathInfo> teamData;

    @ApiModelProperty(value = "memberId / teamId", example = "1", position = 9)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitRefId;

    @ApiModelProperty(value = "default avatar color number", example = "1", position = 10)
    private Integer avatarColor;

    @ApiModelProperty(value = "Nick Name", example = "Zhang San", position = 11)
    private String nickName;
}
