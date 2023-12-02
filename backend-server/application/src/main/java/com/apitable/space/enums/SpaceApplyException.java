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

package com.apitable.space.enums;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * status code range（450-）.
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum SpaceApplyException implements BaseException {

    APPLY_NOT_EXIST(450, "application does not exist"),

    APPLY_EXPIRED_OR_PROCESSED(451, "application has expired or has been processed"),

    EXIST_MEMBER(452, "You are already in this space, the request is invalid"),

    APPLY_SWITCH_CLOSE(453,
        "This space is not allowed to join the application, the application failed"),

    APPLY_DUPLICATE(454,
        "You have submitted an application, pending approval by the administrator"),

    APPLY_NOTIFICATION_ERROR(455, "application message is incorrect");

    private final Integer code;

    private final String message;
}
