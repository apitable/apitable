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

import io.swagger.v3.oas.annotations.media.Schema;
import javax.validation.constraints.Max;
import lombok.Data;

/**
 * <p>
 * User notification list parameters.
 * </p>
 */
@Data
@Schema(description = "User marked read notification")
public class NotificationReadRo {

    @Schema(description = "Notification ID, supporting batch", example = "[\"124324324\","
        + "\"243242\"]", required = true)
    private String[] id;

    @Max(1)
    @Schema(description = "Full 1 full, 0 incomplete", allowableValues = "range[0,1]", type =
        "Integer",
        example = "0")
    private Integer isAll;
}
