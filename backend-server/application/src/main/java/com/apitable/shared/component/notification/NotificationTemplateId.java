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
import lombok.Getter;

/**
 * <p>
 * notification template id.
 * </p>
 *
 * @author zoe zheng
 */
@Getter
public enum NotificationTemplateId implements BaseTemplateId {

    /**
     * Notify administrators when user invites others to join a space.
     */
    INVITE_MEMBER_TO_ADMIN("invite_member_toadmin"),

    /**
     * Notify invited users when invited to a space.
     */
    INVITE_MEMBER_TO_USER("invite_member_touser"),

    /**
     * Notify users when they are invited to join a space as a member.
     */
    INVITE_MEMBER_TO_MYSELF("invite_member_tomyself"),

    /**
     * Notify users when they are assigned to a group in a space.
     */
    ASSIGNED_TO_GROUP("assigned_to_group"),

    /**
     * Notify users when they are removed from a space.
     */
    REMOVE_FROM_SPACE_TO_USER("removed_from_space_touser"),

    /**
     * Notify administrators when a user is removed from a space.
     */
    REMOVE_FROM_SPACE_TO_ADMIN("removed_from_space_toadmin"),

    /**
     * Notify all members when the name of a space is changed.
     */
    SPACE_NAME_CHANGE("space_name_change"),

    /**
     * Notify users when a space reaches its capacity limit.
     */
    CAPACITY_LIMIT("capacity_limit"),

    /**
     * Notify users when a space is deleted.
     */
    SPACE_DELETED("space_deleted"),

    /**
     * Notify users when a datasheet limit is reached in a space.
     */
    DATASHEET_LIMITED("datasheet_limit"),

    /**
     * Notify users when a deleted space is recovered.
     */
    SPACE_RECOVER("space_recover"),

    /**
     * Notify users when they are added as sub-administrators of a space.
     */
    ADD_SUB_ADMIN("add_sub_admin"),

    /**
     * Notify users when they are added as primary administrators of a space.
     */
    SPACE_ADD_PRIMARY_ADMIN("space_add_primary_admin"),

    /**
     * Notify administrators when they quit a space.
     */
    QUIT_SPACE("quit_space"),

    /**
     * Notify administrators when a user applies to join a space.
     */
    SPACE_JOIN_APPLY("space_join_apply"),

    /**
     * Notify users when their application to join a space is approved.
     */
    SPACE_JOIN_APPLY_APPROVED("space_join_apply_approved"),

    /**
     * Notify users when their application to join a space is refused.
     */
    SPACE_JOIN_APPLY_REFUSED("space_join_apply_refused"),

    /**
     * Notify administrators when a member applies to close their account.
     */
    MEMBER_APPLIED_TO_CLOSE_ACCOUNT("member_applied_to_close_account"),

    /**
     * Notify users when they are changed to an ordinary user from an administrator or sub-administrator in a space.
     */
    CHANGE_ORDINARY_USER("changed_ordinary_user"),

    /**
     * Notify users when a field in their profile is updated.
     */
    USER_FIELD("user_field"),

    NODE_CREATE("node_create"),

    NODE_UPDATE("node_update"),

    NODE_UPDATE_DESC("node_update_desc"),

    NODE_MOVE("node_move"),

    NODE_DELETE("node_delete"),

    NODE_UPDATE_ROLE("node_update_role"),

    NODE_SHARE("node_share"),

    NODE_FAVORITE("node_favorite"),

    /**
     * Notify users when they are removed from a space.
     */
    REMOVED_MEMBER_TO_MYSELF("removed_member_tomyself"),

    /**
     * Notify users when they are removed from a group in a space.
     */
    REMOVED_FROM_GROUP("remove_from_group"),

    /**
     * Notify users when they are mentioned in a comment in a space.
     */
    COMMENT_MENTIONED("comment_mentioned"),

    WEB_PUBLISH("web_publish"),

    /**
     * Notify all users when the server is pre-published.
     */
    SERVER_PRE_PUBLISH("server_pre_publish"),

    /**
     * Notify user about integral income.
     */
    INTEGRAL_INCOME_NOTIFY("integral_income_notify"),

    ACTIVITY_PUBLISH("activity_publish"),

    /**
     * Notify users when they are mentioned in a single record.
     */
    SINGLE_RECORD_MEMBER_MENTION("single_record_member_mention"),

    /**
     * Notify users when they are mentioned in a comment on a single record.
     */
    SINGLE_RECORD_COMMENT_MENTIONED("single_record_comment_mentioned"),

    /**
     * Notify administrators when a datasheet's record limit is reached.
     */
    DATASHEET_RECORD_LIMIT("datasheet_record_limit"),

    /**
     * Notify administrators when a space's datasheet limit is reached.
     */
    DATASHEET_LIMIT("datasheet_limit"),

    /**
     * Notify administrators when a space's member limit is reached.
     */
    SPACE_MEMBER_LIMIT("space_member_limit"),

    /**
     * Notify administrators when a space's seats limit is reached.
     */
    SPACE_SEATS_LIMIT("space_seats_limit"),

    /**
     * Notify administrators when a space's record limit is reached.
     */
    SPACE_RECORD_LIMIT("space_record_limit"),

    /**
     * Notify administrators when a space's API limit is reached.
     */
    SPACE_API_LIMIT("space_api_limit"),

    /**
     * Notify administrators when a space's calendar limit is reached.
     */
    SPACE_CALENDAR_LIMIT("space_calendar_limit"),

    /**
     * Notify administrators when a space's form limit is reached.
     */
    SPACE_FORM_LIMIT("space_form_limit"),

    /**
     * Notify administrators when a space's mirror limit is reached.
     */
    SPACE_MIRROR_LIMIT("space_mirror_limit"),

    /**
     * Notify administrators when a space's Gantt chart limit is reached.
     */
    SPACE_GANTT_LIMIT("space_gantt_limit"),

    /**
     * Notify administrators when a space's field permission limit is reached.
     */
    SPACE_FIELD_PERMISSION_LIMIT("space_field_permission_limit"),

    /**
     * Notify administrators when a space's file permission limit is reached.
     */
    SPACE_FILE_PERMISSION_LIMIT("space_file_permission_limit"),

    /**
     * Notify administrators when a space's administrator limit is reached.
     */
    SPACE_ADMIN_LIMIT("space_admin_limit"),

    /**
     * Notify administrators when a space's time machine limit is reached.
     */
    SPACE_TIME_MACHINE_LIMIT("space_time_machine_limit"),

    /**
     * Notify administrators when a space's trash limit is reached.
     */
    SPACE_TRASH_LIMIT("space_trash_limit"),

    /**
     * Notify administrators that watermark is an enterprise-level space feature.
     */
    SPACE_WATERMARK_NOTIFY("space_watermark_notify"),

    /**
     * Notify administrators that refresh contact failed.
     */
    SPACE_REFRESH_CONTACT_SEATS_LIMIT("space_refresh_contact_seats_limit"),

    /**
     * Notify administrators that YozoOffice is an enterprise-level space feature.
     */
    SPACE_YOZOOFFICE_NOTIFY("space_yozooffice_notify"),

    /**
     * Notify administrators that Lark integration is an enterprise-level space feature.
     */
    SPACE_LARK_NOTIFY("space_lark_notify"),

    /**
     * Notify administrators that Dingtalk integration is an enterprise-level space feature.
     */
    SPACE_DINGTALK_NOTIFY("space_dingtalk_notify"),

    /**
     * Notify administrators that Wecon integration is an enterprise-level space feature.
     */
    SPACE_WECOM_NOTIFY("space_wecom_notify"),

    /**
     * Notify administrators about the space's trial period.
     */
    SPACE_TRIAL("space_trial"),

    /**
     * Notify all users when the application for space beta features is approved.
     */
    APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ALL("apply_space_beta_feature_success_notify_all"),

    /**
     * Notify users when the application for space beta features is approved.
     */
    APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ME("apply_space_beta_feature_success_notify_me"),

    /**
     * Notify developer when administrators unpublished widget.
     */
    ADMIN_UNPUBLISH_SPACE_WIDGET_NOTIFY("admin_unpublish_space_widget_notify"),

    /**
     * Notify developer when administrators transfered widget ownership.
     */
    ADMIN_TRANSFER_SPACE_WIDGET_NOTIFY("admin_transfer_space_widget_notify"),

    /**
     * Notify administrators when a new space widget is created.
     */
    NEW_SPACE_WIDGET_NOTIFY("new_space_widget_notify"),

    /**
     * Notify administrators when space successfully subscribed.
     */
    SPACE_SUBSCRIPTION_NOTIFY("space_subscription_notify"),

    COMMON_SYSTEM_NOTIFY("common_system_notify"),

    COMMON_SYSTEM_NOTIFY_WEB("common_system_notify_web"),

    /**
     * Notify certifier when space have completed the certification.
     */
    SPACE_CERTIFICATION_NOTIFY("space_certification_notify"),

    /**
     * Notify certifier when space certification failed.
     */
    SPACE_CERTIFICATION_FAIL_NOTIFY("space_certification_fail_notify"),

    /**
     * Notify user about integral income for an activity.
     */
    ACTIVITY_INTEGRAL_INCOME_NOTIFY("activity_integral_income_notify"),

    /**
     * Notify administrators when the space rainbow label limit is reached.
     */
    SPACE_RAINBOW_LABEL_LIMIT("space_rainbow_label_limit"),

    /**
     * new user welcome notify---->to users.
     */
    NEW_USER_WELCOME_NOTIFY("new_user_welcome_notify"),

    /**
     * adding role members---->to the added user.
     */
    ASSIGNED_TO_ROLE("assigned_to_role"),

    /**
     * removing role members---->to the removed user.
     */
    REMOVED_FROM_ROLE("remove_from_role"),
    ;

    private final String value;

    NotificationTemplateId(String value) {
        this.value = value;
    }

    /**
     * transfer value to enum.
     *
     * @param value value
     * @return enum
     */
    public static NotificationTemplateId getValue(String value) {
        for (NotificationTemplateId enums : NotificationTemplateId.values()) {
            if (enums.value.equals(value)) {
                return enums;
            }
        }
        return null;
    }

    /**
     * record notify.
     *
     * @param templateId template id
     * @return true or false
     */
    public static boolean recordNotify(NotificationTemplateId templateId) {
        if (ObjectUtil.isNotNull(templateId)) {
            return templateId.equals(USER_FIELD) || templateId.equals(COMMENT_MENTIONED)
                || templateId.equals(SINGLE_RECORD_MEMBER_MENTION)
                || templateId.equals(SINGLE_RECORD_COMMENT_MENTIONED);
        }
        return false;
    }

    /**
     * notify when space is deleted.
     *
     * @param templateId template id
     * @return true or false
     */
    public static boolean spaceDeleteNotify(BaseTemplateId templateId) {
        if (ObjectUtil.isNotNull(templateId)) {
            return templateId.equals(SPACE_DELETED);
        }
        return false;
    }
}
