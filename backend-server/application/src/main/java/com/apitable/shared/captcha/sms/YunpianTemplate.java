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

package com.apitable.shared.captcha.sms;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * yunpian sms template.
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum YunpianTemplate {

    /**
     * internation.
     */
    INTERNATION_GENERAL("{}. This is your verification code, please used it in 15 minutes."),

    /**
     * notification for update password success.
     */
    UPDATE_PASSWORD_SUCCESS_NOTICE(
        "You have successfully changed your password. If not your own operation, please change your account password in time.");

    private final String content;
}
