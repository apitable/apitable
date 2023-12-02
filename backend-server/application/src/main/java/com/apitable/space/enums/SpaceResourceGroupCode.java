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

import cn.hutool.core.collection.ListUtil;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * space resource group code.
 * </p>
 *
 * @author zoe zheng
 */
@Getter
@AllArgsConstructor
public enum SpaceResourceGroupCode {

    MANAGE_SPACE("MANAGE_SPACE"),

    MANAGE_WORKBENCH("MANAGE_WORKBENCH"),

    MANAGE_MEMBER("MANAGE_MEMBER"),

    MANAGE_TEAM("MANAGE_TEAM"),

    MANAGE_MAIN_ADMIN("MANAGE_MAIN_ADMIN"),

    MANAGE_SUB_ADMIN("MANAGE_SUB_ADMIN"),

    MANAGE_NORMAL_MEMBER("MANAGE_NORMAL_MEMBER"),

    MANAGE_TEMPLATE("MANAGE_TEMPLATE"),

    MANAGE_SECURITY("MANAGE_SECURITY"),

    MANAGE_INTEGRATION("MANAGE_INTEGRATION"),

    MANAGE_WIDGET("MANAGE_WIDGET"),

    ;

    private final String code;

    public static List<String> codes() {
        return ListUtil.toList(SpaceResourceGroupCode.values()).stream()
            .map(SpaceResourceGroupCode::getCode).collect(Collectors.toList());
    }
}
