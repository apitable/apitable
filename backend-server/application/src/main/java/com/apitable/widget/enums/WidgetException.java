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

package com.apitable.widget.enums;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * status code range（460-）.
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum WidgetException implements BaseException {

    WIDGET_PACKAGE_NOT_EXIST(460, "The widget package does not exist or is not online"),

    WIDGET_NOT_EXIST(461, "Widget does not exist"),

    WIDGET_SPACE_ERROR(462, "The space where the widget is located is inconsistent"),

    WIDGET_DATASHEET_NOT_EXIST(462,
        "The dimensional table referenced by the widget does not exist, the copy failed"),

    WIDGET_NUMBER_LIMIT(462,
        "The number of widget has reached the upper limit, and the creation failed"),

    CREATE_FAIL_CUSTOM_PACKAGEID_REPEAT(466,
        "The applet creation failed, the package Id is duplicated"),

    WIDGET_BANNED(467, "Operation failed, widget banned"),

    RELEASES_FAIL_WIDGET_DISABLED(468,
        "Failed to publish the applet, the widget has been disabled, please contact GM"),

    RELEASES_FAIL_VERSION_NUM_ERROR(469,
        "Failed to publish the applet, the version number does not conform to the specification"),

    RELEASES_FAIL_VERSION_NUM_REPEAT(470,
        "Failed to publish the applet, the version number is duplicated"),

    ROLLBACK_FAIL_VERSION_NUM_ERROR(471,
        "The applet fails to roll back, and the version number does not conform to the specification"),

    ROLLBACK_FAIL_SELECT_VERSION_ERROR(472,
        "The applet fails to roll back, the rollback version number is wrong or fails to pass the audit"),

    RELEASES_FAIL_INCOMPLETE_PARAME(473,
        "Failed to publish the applet, the publishing parameters are incomplete"),

    EN_US_REQUIRED(474, "en-US is required"),

    SUBMIT_FAIL_INCOMPLETE_PARAME(475,
        "The applet submission failed, the submission parameters are incomplete"),

    SUBMIT_FAIL_VERSION_NUM_ERROR(476,
        "The applet submission failed, the version number does not meet the specification"),

    SUBMIT_FAIL_VERSION_NUM_REPEAT(477,
        "The applet submission failed, the version number is duplicated"),

    SUBMIT_FAIL_NO_SUBMIT_METHOD(478, "Space applet, unable to execute submit"),

    ISSUED_GLOBAL_ID_FAIL(479, "Failed to apply for global applet ID, please try again later"),

    WIDGET_AUTH_DATA_AUDIT_FAIL(480, "Applet certification data cannot be reviewed repeatedly"),

    AUDIT_REASON_NOT_EMPTY(481, "Review comments cannot be empty"),

    WIDGET_VERSION_DATA_AUDIT_FAIL(482, "Mini Program version data cannot be reviewed repeatedly"),

    AUDIT_SUBMIT_VERSION_NOT_EXIST(483, "Submit Version Not Exist"),

    ;

    private final Integer code;

    private final String message;
}
