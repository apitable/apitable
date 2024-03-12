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

package com.apitable.organization.dto;

import lombok.Data;

/**
 * member base info dto.
 */
@Data
public class MemberBaseInfoDTO {

    private Long id;

    private String uuid;

    private String memberName;

    private String avatar;

    private Integer color;

    private String nickName;

    private String email;

    private Boolean isActive;

    private Boolean isDeleted;

    private Boolean isPaused = false;

    /**
     * whether the nickname of the user has been changed.
     */
    private Boolean isNickNameModified;

    /**
     * Whether the nickname of the member has been changed.
     */
    private Boolean isMemberNameModified;

}
