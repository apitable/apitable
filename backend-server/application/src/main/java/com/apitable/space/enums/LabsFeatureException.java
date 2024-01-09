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
 * labs feature exception.
 */
@Getter
@AllArgsConstructor
public enum LabsFeatureException implements BaseException {

    SPACE_ID_NOT_EMPTY(952, "space id must not be empty"),

    FEATURE_KEY_IS_NOT_EXIST(953, "feature key does not exist"),

    FEATURE_SCOPE_IS_NOT_EXIST(954, "feature scope does not exist"),

    FEATURE_TYPE_IS_NOT_EXIST(955, "feature type does not exist"),

    FEATURE_ATTRIBUTE_AT_LEAST_ONE(956, "feature attribute at least one"),

    LAB_FEATURE_HAVE_BEEN_EXIST(956, "Lab feature have been existed"),

    LAB_FEATURE_NOT_EXIST(956, "Lab feature not exists"),

    ;

    private final Integer code;

    private final String message;
}
