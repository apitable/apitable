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

package com.apitable.organization.ro;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Email invitation member request parameters
 * </p>
 */
@Data
@ApiModel("Email invitation member request parameters")
public class InviteRo {

    @Valid
    @NotEmpty
    @Size(max = 50, message = "Invite up to 50 members")
    @ApiModelProperty(value = "Invite Member List", required = true, position = 3)
    private List<InviteMemberRo> invite;

    @ApiModelProperty(value = "Password login for human-machine verification, and the front end obtains the value of get NVC Val function (human-machine verification will be performed when not logged in)", example = "FutureIsComing", position = 5)
    private String data;
}
