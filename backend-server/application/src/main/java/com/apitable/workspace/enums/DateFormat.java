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
 * Date format.
 */
@Getter
@AllArgsConstructor
public enum DateFormat {

    SEPARATE(0, "yyyy/MM/dd"),

    NORM(1, "yyyy-MM-dd"),

    INVERSE(2, "dd/MM/yyyy"),

    NORM_MD(3, "MM-dd");

    private final int type;

    private final String pattern;

    /**
     * get pattern by type.
     *
     * @param type type
     * @return pattern
     */
    public static String getPattern(int type) {
        for (DateFormat format : DateFormat.values()) {
            if (format.getType() == type) {
                return format.getPattern();
            }
        }
        return SEPARATE.getPattern();
    }
}
