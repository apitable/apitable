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
import lombok.Data;

/**
 * <p>
 * User notification paging list parameters.
 * </p>
 */
@Data
@Schema(description = "User notification paging list parameters")
public class NotificationPageRo {

    @Schema(description = "Read 1 Read, 0 Unread, Not Transferred means to query all",
        allowableValues = "range[0,1]", type = "Boolean", example = "0")
    private Boolean isRead;

    @Schema(description = "Notification Type", example = "system")
    private String notifyType;

    @Schema(description = "The earliest notification line number", example = "10")
    private Integer rowNo;

    @Schema(description = "Number of entries per page", example = "20")
    private Integer pageSize = 20;
}
