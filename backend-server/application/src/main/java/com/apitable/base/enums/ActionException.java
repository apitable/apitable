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

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * ActionException.
 * status code range（230-299）
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum ActionException implements BaseException {

    MOBILE_SEND_MAX_COUNT_LIMIT(230,
        "The maximum number of SMS messages sent by this phone in one day"),

    EMAIL_SEND_MAX_COUNT_LIMIT(230,
        "The maximum number of emails sent by this phone today has been reached"),

    SMS_SEND_ONLY_ONE_MINUTE(230, "Cannot get repeated within 60 seconds, please try again later"),

    CODE_EMPTY(231, "verification code must be filled"),

    CODE_ERROR_OFTEN(231, "The current verification code is invalid, please get it again"),

    CODE_EXPIRE(231,
        "The verification code has not been obtained or has expired, please obtain it again"),

    CODE_ERROR(231, "incorrect verification code please reenter"),

    NOT_PASS(232, "Not passed verification code verification"),

    SEND_CAPTCHA_TOO_MUSH(233, "Frequent user operations, please try again in 20 minutes"),

    FILE_NOT_SUPPORT_HTML(240, "uploading html files is not currently supported"),

    FILE_EMPTY(240, "file cannot be empty"),

    FILE_ERROR_CONTENT(240, "file content error"),

    FILE_ERROR_PASSWORD(240, "file parsing password error"),

    FILE_ERROR_FORMAT(240, "file format error"),

    FILE_HAS_PASSWORD(240, "file requires permission password to open"),

    FILE_EXCEED_LIMIT(240, "a single upload file should not exceed 20 mb"),

    ROW_EXCEED_LIMIT(240, "The number of lines exceeds the limit of 50000 lines"),

    COLUMN_EXCEED_LIMIT(240, "the number of columns exceeds the 200 limit"),

    FILE_NOT_EXIST(242, "file does not exist"),

    MAN_MACHINE_VERIFICATION_FAILED(250, "captcha failed"),

    SECONDARY_VERIFICATION(251, "secondary verification"),

    ENABLE_SMS_VERIFICATION(252, "The current environment is at risk, please re-validate"),

    OFFICE_PREVIEW_API_FAILED(253,
        "The request failed, the file transfer to preview failed, please try again"),

    OFFICE_PREVIEW_GET_URL_FAILED(254, "The file could not get the preview URL, please try again"),

    OFFICE_PREVIEW_DESTROYED_FAILED(255,
        "The file is corrupt or encrypted and cannot be previewed, please try again");

    private final Integer code;

    private final String message;
}
