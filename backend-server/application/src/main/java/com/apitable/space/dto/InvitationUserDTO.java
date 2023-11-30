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

package com.apitable.space.dto;

import lombok.Builder;
import lombok.Data;

/**
 * invitation user dto.
 */
@Data
@Builder(toBuilder = true)
public class InvitationUserDTO {

    /**
     * invited userId.
     */
    private Long userId;

    /**
     * invited memberId.
     */
    private Long memberId;

    /**
     * memberId to create an invitation link.
     */
    private Long creator;

    /**
     * space id.
     */
    private String spaceId;

    /**
     * node id.
     */
    private String nodeId;
}
