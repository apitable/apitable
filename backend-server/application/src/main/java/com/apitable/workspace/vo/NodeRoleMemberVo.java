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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Node Member View
 * </p>
 */
@Data
@ApiModel("Node Member View")
public class NodeRoleMemberVo {

    @ApiModelProperty(value = "Member ID", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(using = ToStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "Member Name", example = "R&D Department ｜ Zhang San", position = 1)
    private String memberName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Member avatar", example = "http://www.apitable.com/image.png", position = 2)
    private String avatar;

    @ApiModelProperty(value = "Member's Department", example = "Operation Department | Product Department | R&D Department", position = 3)
    private String teams;

    @ApiModelProperty(value = "Role", example = "manager", position = 4)
    private String role;

    @ApiModelProperty(value = "Whether the user has modified the nickname", position = 5)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname", position = 6)
    private Boolean isMemberNameModified;

    @JsonIgnore
    private String uuid;

    @JsonIgnore
    private Boolean isAdmin;

    @ApiModelProperty(value = "default avatar color number", example = "1", position = 7)
    private Integer avatarColor;

    @ApiModelProperty(value = "Nick Name", example = "Zhang San", position = 8)
    private String nickName;
}
