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

package com.apitable.shared.component.notification;

import cn.hutool.core.util.ObjectUtil;

/**
 * <p>
 * notification template id
 * </p>
 *
 * @author zoe zheng
 */
public enum NotificationTemplateId implements BaseTemplateId{

    INVITE_MEMBER_TO_ADMIN("invite_member_toadmin"),

    INVITE_MEMBER_TO_USER("invite_member_touser"),

    ASSIGNED_TO_GROUP("assigned_to_group"),

    REMOVE_FROM_SPACE_TO_USER("removed_from_space_touser"),

    REMOVE_FROM_SPACE_TO_ADMIN("removed_from_space_toadmin"),

    SPACE_NAME_CHANGE("space_name_change"),

    CAPACITY_LIMIT("capacity_limit"),

    SPACE_DELETED("space_deleted"),

    DATASHEET_LIMITED("datasheet_limit"),

    SPACE_RECOVER("space_recover"),

    ADD_SUB_ADMIN("add_sub_admin"),

    SPACE_ADD_PRIMARY_ADMIN("space_add_primary_admin"),

    QUIT_SPACE("quit_space"),

    SPACE_JOIN_APPLY("space_join_apply"),

    SPACE_JOIN_APPLY_APPROVED("space_join_apply_approved"),

    SPACE_JOIN_APPLY_REFUSED("space_join_apply_refused"),

    MEMBER_APPLIED_TO_CLOSE_ACCOUNT("member_applied_to_close_account"),

    CHANGE_ORDINARY_USER("changed_ordinary_user"),

    USER_FIELD("user_field"),

    NODE_CREATE("node_create"),

    NODE_UPDATE("node_update"),

    NODE_UPDATE_DESC("node_update_desc"),

    NODE_MOVE("node_move"),

    NODE_DELETE("node_delete"),

    NODE_UPDATE_ROLE("node_update_role"),

    NODE_SHARE("node_share"),

    NODE_FAVORITE("node_favorite"),

    INVITE_MEMBER_TO_MYSELF("invite_member_tomyself"),

    REMOVED_MEMBER_TO_MYSELF("removed_member_tomyself"),

    REMOVED_FROM_GROUP("remove_from_group"),

    COMMENT_MENTIONED("comment_mentioned"),

    WEB_PUBLISH("web_publish"),

    SERVER_PRE_PUBLISH("server_pre_publish"),

    INTEGRAL_INCOME_NOTIFY("integral_income_notify"),

    ACTIVITY_PUBLISH("activity_publish"),

    SINGLE_RECORD_MEMBER_MENTION("single_record_member_mention"),

    SINGLE_RECORD_COMMENT_MENTIONED("single_record_comment_mentioned"),

    DATASHEET_RECORD_LIMIT("datasheet_record_limit"),

    DATASHEET_LIMIT("datasheet_limit"),

    SPACE_MEMBER_LIMIT("space_member_limit"),

    SPACE_SEATS_LIMIT("space_seats_limit"),

    SPACE_RECORD_LIMIT("space_record_limit"),

    SPACE_API_LIMIT("space_api_limit"),

    SPACE_CALENDAR_LIMIT("space_calendar_limit"),

    SPACE_FORM_LIMIT("space_form_limit"),

    SPACE_MIRROR_LIMIT("space_mirror_limit"),

    SPACE_GANTT_LIMIT("space_gantt_limit"),

    SPACE_FIELD_PERMISSION_LIMIT("space_field_permission_limit"),

    SPACE_FILE_PERMISSION_LIMIT("space_file_permission_limit"),

    SPACE_ADMIN_LIMIT("space_admin_limit"),

    SPACE_TIME_MACHINE_LIMIT("space_time_machine_limit"),

    SPACE_TRASH_LIMIT("space_trash_limit"),

    SPACE_WATERMARK_NOTIFY("space_watermark_notify"),

    SPACE_YOZOOFFICE_NOTIFY("space_yozooffice_notify"),

    SPACE_LARK_NOTIFY("space_lark_notify"),

    SPACE_DINGTALK_NOTIFY("space_dingtalk_notify"),

    SPACE_WECOM_NOTIFY("space_wecom_notify"),

    SPACE_TRIAL("space_trial"),

    APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ALL("apply_space_beta_feature_success_notify_all"),

    APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ME("apply_space_beta_feature_success_notify_me"),

    ADMIN_UNPUBLISH_SPACE_WIDGET_NOTIFY("admin_unpublish_space_widget_notify"),

    ADMIN_TRANSFER_SPACE_WIDGET_NOTIFY("admin_transfer_space_widget_notify"),

    NEW_SPACE_WIDGET_NOTIFY("new_space_widget_notify"),

    SPACE_SUBSCRIPTION_NOTIFY("space_subscription_notify"),

    COMMON_SYSTEM_NOTIFY("common_system_notify"),

    COMMON_SYSTEM_NOTIFY_WEB("common_system_notify_web"),

    SPACE_CERTIFICATION_NOTIFY("space_certification_notify"),

    SPACE_CERTIFICATION_FAIL_NOTIFY("space_certification_fail_notify"),

    ACTIVITY_INTEGRAL_INCOME_NOTIFY("activity_integral_income_notify"),

    SPACE_RAINBOW_LABEL_LIMIT("space_rainbow_label_limit"),


    /**
     * new user welcome notify---->to users
     */
    NEW_USER_WELCOME_NOTIFY("new_user_welcome_notify"),

    /**
     *  adding role members---->to the added user
     */
    ASSIGNED_TO_ROLE("assigned_to_role"),

    /**
     * removing role members---->to the removed user
     */
    REMOVED_FROM_ROLE("remove_from_role"),
    ;

    private final String value;

    NotificationTemplateId(String value) {
        this.value = value;
    }

    public static NotificationTemplateId getValue(String value) {
        for (NotificationTemplateId enums : NotificationTemplateId.values()) {
            if (enums.value.equals(value)) {
                return enums;
            }
        }
        return null;
    }

    public static boolean recordNotify(NotificationTemplateId templateId) {
        if (ObjectUtil.isNotNull(templateId)) {
            return templateId.equals(USER_FIELD) || templateId.equals(COMMENT_MENTIONED)
                    || templateId.equals(SINGLE_RECORD_MEMBER_MENTION)
                    || templateId.equals(SINGLE_RECORD_COMMENT_MENTIONED);
        }
        return false;
    }

    public static boolean spaceDeleteNotify(BaseTemplateId templateId) {
        if (ObjectUtil.isNotNull(templateId)) {
            return templateId.equals(SPACE_DELETED);
        }
        return false;
    }

    @Override
    public String getValue() {
        return value;
    }
}
