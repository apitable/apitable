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

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Organization Unit Information View
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Organization Unit Information View")
public class UnitInfoVo {

    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "Classification: 1-department, 3-member", example = "1", position = 2)
    private Integer type;

    @ApiModelProperty(value = "Organization unit association ID (may be team ID or member ID according to the type)", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitRefId;

    @ApiModelProperty(value = "Department/Member Name", example = "R&D Department｜Zhang San", position = 3)
    private String name;

    @ApiModelProperty(value = "User ID (the actual return is uuid)", dataType = "java.lang.String", example = "1", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @Deprecated
    @ApiModelProperty(value = "User UUID corresponding to the member", hidden = true)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "Member avatar", example = "http://www.apitable.com/image.png", position = 5)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;

    @ApiModelProperty(value = "Whether the member has been activated", example = "true", position = 6)
    private Boolean isActive;

    @ApiModelProperty(value = "Whether the organization unit is deleted", example = "false", position = 7)
    private Boolean isDeleted;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 8)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 9)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "email", example = "test@apitable.com", position = 10)
    private String email;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 11)
    private List<MemberTeamPathInfo> teamData;

    @ApiModelProperty(value = "default avatar color number", position = 12)
    private Integer avatarColor;

    @ApiModelProperty(value = "nick name", position = 13)
    private String nickName;
}
