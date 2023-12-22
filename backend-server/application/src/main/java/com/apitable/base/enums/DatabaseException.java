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

package com.apitable.base.enums;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;


/**
 * <p>
 * database exception.
 * status code range（210-219）
 * </p>
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum DatabaseException implements BaseException {

    QUERY_EMPTY_BY_ID(210, "data does not exist"),

    INSERT_ERROR(211, "failed to add data"),

    EDIT_ERROR(212, "failed to modify data"),

    DELETE_ERROR(213, "failed to delete data");

    private final Integer code;

    private final String message;
}
