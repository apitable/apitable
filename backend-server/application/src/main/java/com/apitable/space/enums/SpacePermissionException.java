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
 * space permission exception.
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum SpacePermissionException implements BaseException {

    NO_RESOURCE_ASSIGNABLE(601, "Permission resources are not assignable"),

    ILLEGAL_ASSIGN_RESOURCE(602, "Illegal allocation of resources"),

    INSUFFICIENT_PERMISSIONS(603, "Insufficient space management rights");

    private final Integer code;

    private final String message;
}
