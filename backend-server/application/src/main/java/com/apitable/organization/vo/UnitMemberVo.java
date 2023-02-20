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
import lombok.Data;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Member Company View
 * </p>
 */
@Data
@ApiModel("Member Company View")
public class UnitMemberVo {

    @ApiModelProperty(value = "Org Unit ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long unitId;

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "User ID (the actual return is uuid)", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @ApiModelProperty(value = "User UUID", dataType = "java.lang.String", example = "1", position = 2)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "Member name (not highlighted)", example = "Zhang San", position = 3)
    private String originName;

    @ApiModelProperty(value = "Member Name", example = "R&D Department｜Zhang San", position = 3)
    private String memberName;

    @ApiModelProperty(value = "Member Email Address", example = "123456@apitable.com", position = 4)
    private String email;

    @ApiModelProperty(value = "Member mobile number", example = "136****9061", position = 5)
    private String mobile;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Member avatar", example = "http://www.apitable.com/image.png", position = 6)
    private String avatar;

    @ApiModelProperty(value = "Whether activated", example = "true", position = 7)
    private Boolean isActive;

    @ApiModelProperty(value = "Member's Department", example = "Operation Department｜Product Department｜R&D Department", position = 8)
    private String teams;

    @ApiModelProperty(value = "Administrator or not", example = "false", position = 7)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAdmin;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 8)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 9)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 10)
    private List<MemberTeamPathInfo> teamData;

    @ApiModelProperty(value = "default avatar color number", example = "1", position = 11)
    private Integer avatarColor;

    @ApiModelProperty(value = "Nick Name", example = "Zhang San", position = 12)
    private String nickName;

    public String getOriginName() {
        return originName != null ? originName : memberName;
    }
}
