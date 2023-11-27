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

import cn.hutool.core.util.StrUtil;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * lab feature scope.
 */
@Getter
@AllArgsConstructor
public enum LabsFeatureScopeEnum {

    USER_SCOPE("user", 1),

    SPACE_SCOPE("space", 2),

    UNKNOWN_SCOPE("unknown", 0);

    private final String scopeName;

    private final Integer scopeCode;

    /**
     * transform scope code to scope enum.
     *
     * @param scopeCode scope code
     * @return scope enum
     */
    public static LabsFeatureScopeEnum ofLabsFeatureScope(Integer scopeCode) {
        for (LabsFeatureScopeEnum scopeEnum : LabsFeatureScopeEnum.values()) {
            if (Objects.equals(scopeCode, scopeEnum.getScopeCode())) {
                return scopeEnum;
            }
        }
        return UNKNOWN_SCOPE;
    }

    /**
     * transform scope name to scope enum.
     *
     * @param scopeName scope name
     * @return scope enum
     */
    public static LabsFeatureScopeEnum ofLabsFeatureScope(String scopeName) {
        if (StrUtil.isBlank(scopeName)) {
            return UNKNOWN_SCOPE;
        }
        for (LabsFeatureScopeEnum scopeEnum : LabsFeatureScopeEnum.values()) {
            if (Objects.equals(scopeName, scopeEnum.getScopeName())) {
                return scopeEnum;
            }
        }
        return UNKNOWN_SCOPE;
    }
}
