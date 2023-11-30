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

import static com.apitable.organization.enums.OrganizationException.DELETE_ACTION_ERROR;

import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.serializer.IBaseEnum;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;

/**
 * delete member type.
 */
@AllArgsConstructor
public enum DeleteMemberType implements IBaseEnum {

    /**
     * deleted from department.
     */
    FROM_TEAM(0, "deleted from department"),

    /**
     * deleted from organization.
     */
    FROM_SPACE(1, "deleted from organization");

    private final int value;

    private final String desc;

    private static final Map<Integer, DeleteMemberType> valueMap = new HashMap<>(16);

    static {
        for (DeleteMemberType type : DeleteMemberType.values()) {
            valueMap.put(type.value, type);
        }
    }


    /**
     * obtain enum by value.
     *
     * @param value value
     * @return enum
     */
    public static DeleteMemberType getByValue(int value) {
        DeleteMemberType result = valueMap.get(value);
        if (result == null) {
            throw new BusinessException(DELETE_ACTION_ERROR);
        }
        return result;
    }

    @Override
    public Integer getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }
}
