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

package com.apitable.shared.constants;

/**
 * <p>
 * notification constants.
 * </p>
 *
 * @author zoe zheng
 */
public class NotificationConstants {

    public static final String BODY_REQUEST_DESC =
        "Description:{\"extras\":{\"viewId\":\"view ID\",\"recordIds\":[\"record ID\", \"record ID\"], \"toast\": "
            +
            "{\"allowPrev\": \"When the page changes toast, do you need to destroy the existing toast on the page，default false\", "
            +
            "\"duration\": \"Auto-off delay, in seconds. Set to 0 to not automatically turn off\", \"msg\": \"the content of the message must be sent\", \"closable\": \"Whether there is a close button, the default is false\", "
            +
            "\"reloadBtnText\": \" button text to refresh the page，Set to an empty string or do not pass this parameter to not display this button\"}}}";

    public static final String BODY_REQUEST_EXAMPLE =
        "{\"extras\":{\"viewId\":\"viwrdXGTaiifG\",\"recordIds\":[\"rec5ckjeq843t\", \"recETGJkQHmbR\"], \"toast\": { "
            +
            "\"allowPrev\": false, \"duration\": 0, \"msg\": \"rich text message content\", \"closable\": false, \"reloadBtnText\": \"click here to refresh the page\"}}}";

    public static final String BODY_EXTRAS = "extras";

    public static final String URL_HOST_TAG = "host";

    public static final String BODY_EXTRAS_DESC =
        "Description:{\"viewId\":\"view ID\",\"recordIds\":[\"record ID 1\", \"record ID 2\"]}";

    public static final String BODY_EXTRAS_EXAMPLE =
        "{\"viewId\":\"viwrdXGTaiifG\",\"recordIds\":[\"rec5ckjeq843t\", \"recETGJkQHmbR\"]}";

    public static final String TO_MANAGE_MEMBER_RESOURCE_CODE = "MANAGE_MEMBER";

    public static final String RECORD_MENTION_TIMES = "times";

    public static final String INVOLVE_MEMBER_ID = "involveMemberId";

    public static final String INVOLVE_MEMBER_DETAIL = "involveMemberDetail";

    public static final String INVOLVE_RECORD_IDS = "recordIds";

    public static final String OLD_SPACE_NAME = "oldSpaceName";

    public static final String NEW_SPACE_NAME = "newSpaceName";

    public static final String TEAM_NAME = "teamName";

    public static final String TEAM_ID = "teamId";

    public static final String APPLY_ID = "applyId";

    public static final String APPLY_STATUS = "applyStatus";

    public static final String COUNT = "count";

    public static final String ACTION_NAME = "actionName";

    public static final String ACTIVITY_NAME = "activityName";

    public static final String EXPIRE_AT = "expireAt";

    public static final String WIDGET_NAME = "widgetName";

    public static final String PLAN_NAME = "planName";

    public static final String PAY_FEE = "payFee";

    public static final String SPECIFICATION = "specification";

    public static final String EMAIL_NODE_NAME = "NODE_NAME";

    public static final String EMAIL_DATASHEET_URL = "DATASHEET_URL";

    public static final String EMAIL_SPACE_NAME = "SPACE_NAME";

    public static final String EMAIL_RECORD_ID = "RECORD_ID";

    public static final String EMAIL_VIEW_ID = "VIEW_ID";

    public static final String EMAIL_RECORD_URL = "RECORD_URL";

    public static final String EMAIL_MEMBER_NAME = "MEMBER_NAME";

    public static final String EMAIL_URL = "URL";

    public static final String EMAIL_CREATED_AT = "CREATED_AT";

    /**
     * notification toast.
     */
    public static final String EXTRA_TOAST = "toast";

    /**
     * notification toast url.
     */
    public static final String EXTRA_TOAST_URL = "url";

    /**
     * the keyword about role in notifications body  {extras:roleName}.
     */
    public static final String ROLE_NAME = "roleName";

    /**
     * toast close event name.
     */
    public static final String EXTRA_TOAST_CLOSE = "onClose";

}
