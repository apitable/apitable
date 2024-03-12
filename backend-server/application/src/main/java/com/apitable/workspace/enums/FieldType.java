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
 * field type.
 * </p>
 *
 * @author Benson Cheung
 */
@Getter
@AllArgsConstructor
public enum FieldType {

    NOT_SUPPORT(0),

    TEXT(1),

    NUMBER(2),

    SINGLE_SELECT(3),

    MULTI_SELECT(4),

    DATETIME(5),

    ATTACHMENT(6),

    LINK(7),

    URL(8),

    EMAIL(9),

    PHONE(10),

    CHECKBOX(11),

    RATING(12),

    MEMBER(13),

    LOOKUP(14),

    ROLLUP(15),

    FORMULA(16),

    CURRENCY(17),

    PERCENT(18),

    SINGLE_TEXT(19),

    AUTO_NUMBER(20),

    CREATED_TIME(21),

    LAST_MODIFIED_TIME(22),

    CREATED_BY(23),

    LAST_MODIFIED_BY(24),

    CASCADER(25),

    ONE_WAY_LINK(26),

    WORK_DOC(27),

    BUTTON(28),

    ;

    private final int fieldType;

    /**
     * create field type.
     *
     * @param fieldType field type
     * @return field type
     */
    public static FieldType create(int fieldType) {
        for (FieldType type : FieldType.values()) {
            if (type.getFieldType() == fieldType) {
                return type;
            }
        }
        return NOT_SUPPORT;
    }
}
