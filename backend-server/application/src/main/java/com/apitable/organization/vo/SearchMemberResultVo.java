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

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Search Member Results View
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Search Member Results View")
public class SearchMemberResultVo {

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "Member Name", example = "Zhang San", position = 2)
    private String memberName;

    @ApiModelProperty(value = "Member name (not highlighted)", example = "Zhang San", position = 2)
    private String originName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Head portrait", example = "https://...", position = 3)
    private String avatar;

    @ApiModelProperty(value = "Department", example = "Technical team", position = 4)
    private String team;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 5)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 6)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "member is active", position = 7)
    private Boolean isActive;

    @ApiModelProperty(value = "team id and full hierarchy team path name", position = 8)
    private List<MemberTeamPathInfo> teamData;

    @ApiModelProperty(value = "default avatar color number", example = "1", position = 10)
    private Integer avatarColor;

    @ApiModelProperty(value = "Nick Name", example = "Zhang San", position = 11)
    private String nickName;
}
