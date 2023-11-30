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

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * audit category in space.
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum AuditSpaceCategory {

    /**
     * space change event.
     */
    SPACE_CHANGE_EVENT,

    /**
     * work catalog change event.
     */
    WORK_CATALOG_CHANGE_EVENT,

    /**
     * work catalog share event.
     */
    WORK_CATALOG_SHARE_EVENT,

    /**
     * work catalog permission change event.
     */
    WORK_CATALOG_PERMISSION_CHANGE_EVENT,

    /**
     * space template event.
     */
    SPACE_TEMPLATE_EVENT,

    ;

    /**
     * to enum.
     *
     * @param name name
     * @return enum
     */
    public static AuditSpaceCategory toEnum(String name) {
        for (AuditSpaceCategory value : AuditSpaceCategory.values()) {
            if (value.name().toLowerCase().equals(name)) {
                return value;
            }
        }
        throw new IllegalArgumentException("unknown audit category type.");
    }
}
