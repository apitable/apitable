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

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.support.serializer.ChinaLocalDateTimeToUtcSerializer;
import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.MobilePhoneHideSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Member Details View
 * </p>
 */
@Data
@ApiModel("Member Details View")
public class MemberInfoVo {

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Head portrait address", example = "http://wwww.apitable.com/2019/11/12/17123187253.png", position = 2)
    private String avatar;

    @ApiModelProperty(value = "User nickname", example = "This is a user nickname", position = 2)
    private String nickName;

    @ApiModelProperty(value = "Member Name", example = "Zhang San", position = 2)
    private String memberName;

    @ApiModelProperty(value = "Job No", example = "000101", position = 3)
    private String jobNumber;

    @ApiModelProperty(value = "Position", example = "Manager", position = 4)
    private String position;

    @ApiModelProperty(value = "Phone number", example = "13610102020", position = 4)
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = MobilePhoneHideSerializer.class)
    private String mobile;

    @ApiModelProperty(value = "Email", example = "example@qq.com", position = 5)
    private String email;

    @ApiModelProperty(value = "Department", position = 7)
    private List<TeamVo> teams;

    @ApiModelProperty(value = "Label", position = 8)
    private List<TagVo> tags;

    @ApiModelProperty(value = "role", position = 8)
    private List<RoleVo> roles;

    @ApiModelProperty(value = "Administrator or not", example = "true", position = 5)
    private Boolean isAdmin;

    @ApiModelProperty(value = "Primary administrator or not", example = "true", position = 5)
    private Boolean isMainAdmin;

    @ApiModelProperty(value = "Whether activated", example = "true", position = 5)
    private Boolean isActive;

    @ApiModelProperty(value = "Creat time", example = "2020-03-18T15:29:59.000", position = 9)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createTime;

    @ApiModelProperty(value = "Update time", example = "2020-03-18T15:29:59.000", position = 10)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime updateTime;

    @ApiModelProperty(value = "Creat time", example = "2020-03-18T15:29:59.000", position = 9)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "Update time", example = "2020-03-18T15:29:59.000", position = 10)
    @JsonSerialize(using = ChinaLocalDateTimeToUtcSerializer.class)
    private LocalDateTime updatedAt;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 11)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 12)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 13)
    private List<MemberTeamPathInfo> teamData;

    @ApiModelProperty(value = "default avatar color number", example = "1", position = 14)
    private Integer avatarColor;
}
