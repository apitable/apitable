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

import com.apitable.control.infrastructure.role.ControlRole;
import java.util.LinkedHashMap;

/**
 * Control role Dict.
 *
 * @author Shawn Deng
 */
public class ControlRoleDict extends LinkedHashMap<String, ControlRole> {

    private static final long serialVersionUID = -7810769751186072489L;

    static final float DEFAULT_LOAD_FACTOR = 0.75f;

    static final int DEFAULT_CAPACITY = 1 << 4;

    public static ControlRoleDict create() {
        return new ControlRoleDict();
    }

    public ControlRoleDict() {
        this(DEFAULT_CAPACITY);
    }

    public ControlRoleDict(int initialCapacity) {
        this(initialCapacity, DEFAULT_LOAD_FACTOR);
    }

    public ControlRoleDict(int initialCapacity, float loadFactor) {
        super(initialCapacity, loadFactor);
    }

    @Override
    public ControlRoleDict clone() {
        return (ControlRoleDict) super.clone();
    }
}
