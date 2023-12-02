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

package com.apitable.organization.enums;

import com.apitable.core.exception.BusinessException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * Organization unit type.
 * </p>
 *
 * @author Shawn Deng
 */
@AllArgsConstructor
@Getter
public enum UnitType {

    TEAM(1),

    ROLE(2),

    MEMBER(3);

    private final Integer type;

    /**
     * Convert to enum.
     *
     * @param type type
     * @return enum
     */
    public static UnitType toEnum(Integer type) {
        if (null != type) {
            for (UnitType e : UnitType.values()) {
                if (e.getType().equals(type)) {
                    return e;
                }
            }
        }
        throw new BusinessException("unknown unit type");
    }
}
