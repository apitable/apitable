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

package com.apitable.control.infrastructure;

import cn.hutool.core.util.StrUtil;
import com.apitable.control.infrastructure.role.RoleConstants.Node;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Export Level.
 *
 * @author tao
 */
@Getter
@AllArgsConstructor
public enum ExportLevelEnum {

    LEVEL_CLOSED(0, StrUtil.EMPTY),

    LEVEL_BEYOND_READ(1, Node.READER),

    LEVEL_BEYOND_EDIT(2, Node.EDITOR),

    LEVEL_MANAGE(3, Node.MANAGER),

    LEVEL_BEYOND_UPDATE(4, Node.UPDATER);

    private final Integer value;

    private final String roleCode;

    /**
     * transform value to enum.
     *
     * @param value value
     * @return enum
     */
    public static ExportLevelEnum toEnum(int value) {
        for (ExportLevelEnum e : ExportLevelEnum.values()) {
            if (e.getValue() == value) {
                return e;
            }
        }
        throw new RuntimeException("unknown export type");
    }
}
