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

package com.apitable.control.infrastructure.permission;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Field Permission Definition.
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum FieldPermission implements PermissionDefinition {

    READ_FIELD_DATA(2, "readable", 1L),

    EDIT_FIELD_DATA(2, "editable", 1L << 1);

    /**
     * permission group.
     */
    private final int group;

    private final String code;

    private final long value;
}
