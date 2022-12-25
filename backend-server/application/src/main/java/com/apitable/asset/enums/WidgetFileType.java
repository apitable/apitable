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

package com.apitable.asset.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.serializer.IBaseEnum;

/**
 * @author tao
 */
@Getter
@AllArgsConstructor
public enum WidgetFileType implements IBaseEnum {
    /**
     * the widget asset
     */
    ASSET(0),
    /**
     * the packaging file
     */
    PACKAGE(1),
    /**
     * cover, icon
     */
    PUBLIC(2);


    private final Integer value;

    public static WidgetFileType of(Integer value) {
        for (WidgetFileType type : WidgetFileType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("Unknown WidgetFileType");
    }
}