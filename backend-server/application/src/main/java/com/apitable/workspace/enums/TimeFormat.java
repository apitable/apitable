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

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * date formatter enum.
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum TimeFormat {

    TIME(0, "HH:mm");

    private final int type;

    private final String pattern;

    /**
     * <p>
     * get pattern by type.
     * </p>
     *
     * @param type type
     * @return pattern
     */
    public static String getPattern(int type) {
        for (TimeFormat format : TimeFormat.values()) {
            if (format.getType() == type) {
                return format.getPattern();
            }
        }
        return TIME.getPattern();
    }
}
