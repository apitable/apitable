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

package com.apitable.workspace.ro;

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Mention member request parameters
 * </p>
 */
@Data
@ApiModel("Mention member request parameters")
public class RemindMemberRo {

    @ApiModelProperty(value = "Whether to enable notification", example = "true", required = true)
    @NotNull(message = "Whether to enable notification cannot be blank")
    private Boolean isNotify;

    @ApiModelProperty(value = "Node ID", example = "dstiHMuQnhWkVxBKkU", position = 1)
    private String nodeId;

    @ApiModelProperty(value = "View ID", example = "viwwkxEZ3XaDg", position = 2)
    private String viewId;

    @ApiModelProperty(value = "Organizational Unit and Record List", position = 3, required = true)
    @NotEmpty(message = "Organizational unit and record list cannot be empty")
    private List<RemindUnitRecRo> unitRecs;

    @ApiModelProperty(value = "Association ID: node sharing ID, template ID", example = "shr8T8vAfehg3yj3McmDG", position = 4)
    private String linkId;

    @ApiModelProperty(value = "Type of notification: 1 member notification, 2 comment notification", example = "1", position = 5)
    private Integer type = 1;

    @ApiModelProperty(value = "Send additional content of email notification", example = "@aaa&nbsp;&nbsp;Incorrect", position = 6)
    private RemindExtraRo extra = null;
}
