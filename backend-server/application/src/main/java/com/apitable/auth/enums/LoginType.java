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

package com.apitable.auth.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * login verification type
 * </p>
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum LoginType {

    /**
     * password
     */
    PASSWORD("password"),

    /**
     * sms code
     */
    SMS_CODE("sms_code"),

    /**
     * email code
     */
    EMAIL_CODE("email_code"),

    /**
     * sso auth
     */
    SSO_AUTH("sso_auth");

    @JsonValue
    private final String value;
}
