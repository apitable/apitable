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

package com.apitable.user.enums;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * developer exception.
 */
@Getter
@AllArgsConstructor
public enum DeveloperException implements BaseException {

    HAS_CREATE(1001, "cannot be reproduced"),

    GENERATE_API_KEY_ERROR(1002, "failed to generate developer access token"),

    USER_DEVELOPER_NOT_FOUND(1003, "the user has not activated the developer platform"),

    INVALID_DEVELOPER_TOKEN(1004, "invalid access token");

    private final Integer code;

    private final String message;
}
