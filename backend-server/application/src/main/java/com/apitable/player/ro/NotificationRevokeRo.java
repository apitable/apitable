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

package com.apitable.player.ro;

import java.util.List;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/** 
* <p> 
* Undo notification parameters
* </p>
*/
@Data
@ApiModel("Undo notification parameters")
public class NotificationRevokeRo {

    @ApiModelProperty(value = "Uuid of the notified user (optional)", position = 1 )
    private List<String> uuid;

    @ApiModelProperty(value = "Space ID (optional, either uuid or space ID)", example = "spcHKrd0liUcl", position = 5)
    protected String spaceId = null;

    @NotBlank(message = "Template ID cannot be empty")
    @ApiModelProperty(value = "Template ID", example = "user_filed", required = true,
            position = 2)
    private String templateId;

    @ApiModelProperty(value = "Version number (optional)", example = "v0.12.1.release", position = 3)
    private String version;

    @ApiModelProperty(value = "Expiration time (optional) accurate to milliseconds", example = "1614587900000", position = 4)
    private String expireAt;

    @ApiModelProperty(value = "Undo type: 1 read, 2 delete, read by default", example = "1614587900000", position = 5)
    private int revokeType = 1;
}
