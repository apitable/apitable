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

package com.apitable.automation.enums;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * automation exception.
 * </p>
 *
 * @author feng penglong
 */
@Getter
@AllArgsConstructor
public enum AutomationException implements BaseException {

    DST_ROBOT_LIMIT(1101, "The single-table robot has reached the upper limit"),

    DST_ROBOT_REPEAT(1102, "Do not recreate"),

    AUTOMATION_ERROR(1103, "Server error"),

    AUTOMATION_ROBOT_NOT_EXIST(1104, "The automation not exits"),

    AUTOMATION_TRIGGER_LIMIT(1105, "The number of triggers cannot exceed 3"),

    AUTOMATION_TRIGGER_NOT_EXIST(1106, "The trigger not exits"),

    ;

    private final Integer code;

    private final String message;
}
