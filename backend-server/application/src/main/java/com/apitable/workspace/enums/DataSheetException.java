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

package com.apitable.workspace.enums;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * DataSheet Exception.
 * status code range（440-449）
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum DataSheetException implements BaseException {

    DATASHEET_NOT_EXIST(440, "sheet does not exist"),

    VIEW_NOT_EXIST(440, "view does not exist"),

    FIELD_NOT_EXIST(440, "field does not exist"),

    CREATE_FAIL(442, "failed to create file"),

    ATTACH_CITE_FAIL(443, "attachment reference calculation failed");

    private final Integer code;

    private final String message;
}
