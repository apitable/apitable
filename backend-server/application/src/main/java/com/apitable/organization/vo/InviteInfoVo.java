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

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.support.serializer.NullBooleanSerializer;

/**
 * <p>
 * Invitation Information View
 * </p>
 */
@Data
@ApiModel("Invitation Information View")
public class InviteInfoVo {

    @ApiModelProperty(value = "Space ID", example = "spcyQkKp9XJEl", position = 1)
    private String spaceId;

    @ApiModelProperty(value = "Space name", example = "Work space", position = 2)
    private String spaceName;

    @ApiModelProperty(value = "Invite Users", example = "Zhang San", position = 3)
    private String inviter;

    @ApiModelProperty(value = "Invited Email", example = "xxxx@apitable.com", position = 4)
    private String inviteEmail;

    @ApiModelProperty(value = "Whether it is in login status", example = "true", position = 5)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isLogin;

    @ApiModelProperty(value = "Whether the invited mailbox has an account bound", example = "true", position = 6)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isBound;

    @ApiModelProperty(value = "Inviter's personal invitation code", example = "test", position = 7)
    private String inviteCode;
}
