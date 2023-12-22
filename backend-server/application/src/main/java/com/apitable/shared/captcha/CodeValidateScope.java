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

package com.apitable.shared.captcha;

/**
 * <p>
 * global captcha business type scope.
 * </p>
 *
 * @author Shawn Deng
 */
public enum CodeValidateScope {

    REGISTER,

    LOGIN,

    UPDATE_PWD,

    BOUND_MOBILE,

    UN_BOUND_MOBILE,

    UPDATE_EMAIL,

    BOUND_EMAIL,

    REGISTER_EMAIL,

    COMMON_VERIFICATION,

    DEL_SPACE,

    UPDATE_MAIN_ADMIN,

    BOUND_DINGTALK,

    GENERAL_VERIFICATION,

    RESET_API_KEY,

    SOCIAL_USER_BIND;

    /**
     * transform name to enum.
     *
     * @param name name
     * @return enum
     */
    public static CodeValidateScope fromName(String name) {
        CodeValidateScope scope = null;
        for (CodeValidateScope ele : CodeValidateScope.values()) {
            if (ele.name().equalsIgnoreCase(name)) {
                scope = ele;
                break;
            }
        }

        if (scope == null) {
            throw new IllegalArgumentException("unknown captcha type");
        }

        return scope;
    }
}
