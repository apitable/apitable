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

package com.apitable.space.ro;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Space management - common members set request parameters
 * </p>
 *
 * The status field is consistent with the serialized object of the read library
 */
@Data
@ApiModel("Space management - common members set request parameters")
public class SpaceMemberSettingRo {

    @ApiModelProperty(value = "Invitable status of all staff", example = "true", position = 1)
    private Boolean invitable;

    @ApiModelProperty(value = "Allow others to apply for space status", example = "false", position = 2)
    private Boolean joinable;

    @ApiModelProperty(value = "Display member's mobile number", example = "false", position = 3)
    private Boolean mobileShowable;

}
