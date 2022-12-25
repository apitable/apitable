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

package com.apitable.space.vo;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Space public invitation link information vo
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Space public invitation link information vo")
public class SpaceLinkInfoVo {

    @ApiModelProperty(value = "Creator name", example = "Zhang San", position = 1)
    private String memberName;

    @ApiModelProperty(value = "Space name", example = "This is a space", position = 2)
    private String spaceName;

    @ApiModelProperty(value = "Space ID", example = "spc10", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String spaceId;

    @ApiModelProperty(value = "Whether it is in login status, not logged in", example = "true", position = 4)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isLogin;

    @ApiModelProperty(value = "Whether it already exists in the space, and directly call the switching space interface in the existing space", example = "true", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isExist;

    @ApiModelProperty(value = "Inviter's personal invitation code", example = "test", position = 6)
    private String inviteCode;
}
