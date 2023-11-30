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

package com.apitable.base.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * system config type.
 *
 * @author tao
 */
@Getter
@AllArgsConstructor
public enum SystemConfigType {

    /**
     * 0:wizard.
     */
    WIZARD_CONFIG(0),
    /**
     * 1:recommend.
     */
    RECOMMEND_CONFIG(1),
    /**
     * 2:gm permission.
     */
    GM_PERMISSION_CONFIG(2),

    ;

    private final int type;
}
