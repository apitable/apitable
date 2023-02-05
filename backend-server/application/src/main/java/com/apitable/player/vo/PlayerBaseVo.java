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

package com.apitable.player.vo;

import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * Basic user information
 * </p>
 */
@Data
@ApiModel("Basic user information")
@Builder
public class PlayerBaseVo {

    @ApiModelProperty(value = "User's Uuid", example = "aadddbccc")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @ApiModelProperty(value = "Member ID", example = "1261273764218")
    @JsonSerialize(using = ToStringSerializer.class, nullsUsing = NullStringSerializer.class)
    private Long memberId;

    @ApiModelProperty(value = "User Name", example = "zoe")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userName;

    @ApiModelProperty(value = "Member Name", example = "zoe zheng")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String memberName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "HEAD PORTRAIT", example = "zoe zheng")
    private String avatar;

    @ApiModelProperty(value = "DEPARTMENT", example = "Operation Department｜Planning Department")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String team;

    @ApiModelProperty(value = "Whether the user has modified the nickname")
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "Whether the member has modified the nickname")
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "Email", example = "52906715@qq.com")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String email;

    @Deprecated
    @ApiModelProperty(value = "Whether the space station has been removed", example = "true", hidden = true)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isDeleted;

    @ApiModelProperty(value = "User player type 1: members in the space have not been removed, 2 members outside the space have been removed, and 3 visitors (non space registered users)", example = "1")
    private Integer playerType;

    @ApiModelProperty(value = "default avatar color number", example = "1")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private Integer avatarColor;

    @ApiModelProperty(value = "Nick Name", example = "Zhang San")
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String nickName;
}
