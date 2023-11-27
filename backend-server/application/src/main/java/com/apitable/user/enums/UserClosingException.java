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

package com.apitable.user.enums;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * user closing exception.
 */
@Getter
@AllArgsConstructor
public enum UserClosingException implements BaseException {

    USER_APPLIED_FOR_CLOSING(960, "User has applied for account cancellation"),

    USER_CANCELED_CLOSING(961, "The user has withdrawn the cancellation request"),

    USER_NOT_ALLOWED_TO_CLOSE(962,
        "If the logout conditions are not met, the user is not allowed to logout"),

    USER_NOT_ALLOWED_CANCEL_CLOSING(963,
        "Cancellation cannot be cancelled if no cancellation application has been initiated"),

    USER_HISTORY_RECORD_ISSUE(964,
        "The user has applied for cancellation, but the operation data is abnormal and the official cancellation date cannot be calculated");

    private final Integer code;

    private final String message;
}
