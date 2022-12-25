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

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Comment on specific content
 * </p>
 */
@Data
@ApiModel("Other reminders")
public class RemindExtraRo {

    @Deprecated
    @ApiModelProperty(value = "Record Title", example = "First column", position = 1, required = true)
    private String recordTitle;

    @ApiModelProperty(value = "Comments", example = "@zoe&nbsp;&nbsp;Comments", position = 2, required = true)
    @NotEmpty(message = "Comments")
    private String content;

    @Deprecated
    @ApiModelProperty(value = "Comment time", example = "2020.11.26 10:30:36", position = 3, required = true)
    @NotEmpty(message = "Comment time")
    private String createdAt;

}
