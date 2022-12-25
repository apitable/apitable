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
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Page: member list view
 * </p>
 */
@Data
@ApiModel("Page: member list view")
public class MemberPageVo {

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

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Phone number", example = "13344445555", position = 3)
    private String mobile;

    @ApiModelProperty(value = "Email", example = "example@qq.com", position = 5)
    private String email;

    @ApiModelProperty(value = "Department ID", example = "1,2,3", position = 6)
    private String teamIds;

    @ApiModelProperty(value = "Department", example = "R&D Department | Operation Department | Design Department", position = 7)
    private String teams;

    @ApiModelProperty(value = "Whether activated", example = "true", position = 8)
    private Boolean isActive;

    @ApiModelProperty(value = "Primary administrator or not", example = "false", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isPrimary;

    @ApiModelProperty(value = "Sub administrator or not", example = "false", position = 9)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isSubAdmin;

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

    @ApiModelProperty(value = "team' id and full hierarchy team path name", position = 13)
    private List<MemberTeamPathInfo> teamData;

    @ApiModelProperty(value = "default avatar color number", example = "1", position = 14)
    private Integer avatarColor;
}
