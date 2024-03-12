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
 * <p>
 * subscription exception.
 * </p>
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum SubscribeFunctionException implements BaseException {

    NODE_LIMIT(951, "The number of tables exceeds the limit"),

    CAPACITY_LIMIT(951, "Capacity exceeds limit"),

    ROW_LIMIT(951, "The number of lines exceeds the limit"),

    ADMIN_LIMIT(951, "The number of administrators exceeds the limit"),

    MEMBER_LIMIT(951, "The number of members exceeds the limit"),

    AUDIT_LIMIT(951, "Audit query days exceed the limit"),

    ;

    private final Integer code;

    private final String message;
}
