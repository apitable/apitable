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

package com.apitable.player.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * Notification model.
 */
@Data
public class NotificationModelDTO {

    /**
     * id.
     */
    private Long id;

    /**
     * is read.
     */
    private Integer isRead;

    /**
     * notify type.
     */
    private String notifyType;

    /**
     * created time.
     */
    private LocalDateTime createdAt;

    /**
     * update time.
     */
    private LocalDateTime updatedAt;

    /**
     * node id.
     */
    private String nodeId;

    /**
     * space id.
     */
    private String spaceId;

    /**
     * to user id.
     */
    private Long toUser;

    /**
     * template id.
     */
    private String templateId;

    /**
     * from user id.
     */
    private Long fromUser;

    /**
     * notify body.
     */
    private String notifyBody;

    /**
     * row number.
     */
    private Integer rowNo;
}
