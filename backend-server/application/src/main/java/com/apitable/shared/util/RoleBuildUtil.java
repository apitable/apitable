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

package com.apitable.shared.util;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;

/**
 * <p>
 * Role util.
 * </p>
 *
 * @author Shawn Deng
 */
public class RoleBuildUtil {

    public static String createRoleCode(String spaceId) {
        return StrUtil.join("_", "ROLE", spaceId.toUpperCase(),
            StrUtil.subWithLength(IdUtil.fastSimpleUUID(), 0, 6).toUpperCase());
    }

    public static String createRoleName(String spaceId) {
        return StrUtil.join("_", spaceId.toUpperCase(), "SUB_ADMIN");
    }
}
