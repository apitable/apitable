package com.vikadata.api.component.notification;

import cn.hutool.core.util.ObjectUtil;
import lombok.Getter;

/**
 * <p>
 * 通知模版枚举
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/28 3:47 下午
 */
@Getter
public enum NotificationTemplateId {
    /**
     * 邀请用户--->to管理员
     */
    INVITE_MEMBER_TO_ADMIN("invite_member_toadmin"),
    /**
     * 邀请用户---->to邀请用户
     */
    INVITE_MEMBER_TO_USER("invite_member_touser"),
    /**
     * 添加部门成员---->to添加的用户
     */
    ASSIGNED_TO_GROUP("assigned_to_group"),
    /**
     * 移除空间成员---->to添加的用户
     */
    REMOVE_FROM_SPACE_TO_USER("removed_from_space_touser"),
    /**
     * 移除空间成员---->to添加的用户
     */
    REMOVE_FROM_SPACE_TO_ADMIN("removed_from_space_toadmin"),
    /**
     * 空间名称修改---->to全部管理员
     */
    SPACE_NAME_CHANGE("space_name_change"),
    /**
     * 空间容量上限---->to全部成员
     */
    CAPACITY_LIMIT("capacity_limit"),
    /**
     * 空间删除---->to全部成员
     */
    SPACE_DELETED("space_deleted"),
    /**
     * 数表上限---->to全部成员
     */
    DATASHEET_LIMITED("datasheet_limit"),
    /**
     * 空间恢复---->to全部成员
     */
    SPACE_RECOVER("space_recover"),
    /**
     * 添加子管理员---->to添加的成员
     */
    ADD_SUB_ADMIN("add_sub_admin"),
    /**
     * 更换主管理员---->to更换的成员
     */
    SPACE_ADD_PRIMARY_ADMIN("space_add_primary_admin"),
    /**
     * 成员退出空间---->to有成员管理权限的管理员
     */
    QUIT_SPACE("quit_space"),
    /**
     * 空间加入申请---->to有成员管理权限的管理员
     */
    SPACE_JOIN_APPLY("space_join_apply"),
    /**
     * 空间加入申请通过---->to申请用户
     */
    SPACE_JOIN_APPLY_APPROVED("space_join_apply_approved"),
    /**
     * 空间加入申请被拒绝---->to申请用户
     */
    SPACE_JOIN_APPLY_REFUSED("space_join_apply_refused"),
    /**
     * 成员申请注销账号--->to main admin
     */
    MEMBER_APPLIED_TO_CLOSE_ACCOUNT("member_applied_to_close_account"),
    /**
     * 将管理员设置成普通成员---->to成员
     */
    CHANGE_ORDINARY_USER("changed_ordinary_user"),
    /**
     * 成员提及----->to被提及的成员
     */
    USER_FIELD("user_field"),
    /**
     * 节点添加----->to长链发送给空间所有人
     */
    NODE_CREATE("node_create"),
    /**
     * 节点修改----->to长链发送给空间所有人
     */
    NODE_UPDATE("node_update"),
    /**
     * 节点修改描述----->to长链发送给空间所有人
     */
    NODE_UPDATE_DESC("node_update_desc"),
    /**
     * 节点移动----->to长链发送给空间所有人
     */
    NODE_MOVE("node_move"),
    /**
     * 节点删除----->to长链发送给空间所有人
     */
    NODE_DELETE("node_delete"),
    /**
     * 节点修改权限----->to长链发送给空间所有人
     */
    NODE_UPDATE_ROLE("node_update_role"),
    /**
     * 节点修改权分享----->to长链发送给空间所有人
     */
    NODE_SHARE("node_share"),
    /**
     * 节点收藏修改----->to长链发送给自己
     */
    NODE_FAVORITE("node_favorite"),
    /**
     * 邀请用户----->to邀请人
     */
    INVITE_MEMBER_TO_MYSELF("invite_member_tomyself"),
    /**
     * 邀请用户----->to删除人
     */
    REMOVED_MEMBER_TO_MYSELF("removed_member_tomyself"),
    /**
     * 将成员移出小组----->to删除的人
     */
    REMOVED_FROM_GROUP("remove_from_group"),
    /**
     * 评论提及
     */
    COMMENT_MENTIONED("comment_mentioned"),
    /**
     * 前端web发布----->to所有人
     */
    WEB_PUBLISH("web_publish"),
    /**
     * 服务端发布之前的消息----->to所有人
     */
    SERVER_PRE_PUBLISH("server_pre_publish"),
    /**
     * 积分收入通知----->to指定用户
     */
    INTEGRAL_INCOME_NOTIFY("integral_income_notify"),
    /**
     * 活动发布通知----->to所有人
     */
    ACTIVITY_PUBLISH("activity_publish"),

    /**
     * 单条记录成员提及----->to被提及的成员
     */
    SINGLE_RECORD_MEMBER_MENTION("single_record_member_mention"),

    /**
     * 单条记录评论新通知模版----->to被提及的成员
     */
    SINGLE_RECORD_COMMENT_MENTIONED("single_record_comment_mentioned"),

    /**
     * 单个维格表行数已达上限----->to空间站管理员
     */
    DATASHEET_RECORD_LIMIT("datasheet_record_limit"),

    /**
     * 文件数量已达上限----->to空间站管理员
     */
    DATASHEET_LIMIT("datasheet_limit"),
    /**
     * 空间站总成员数已达上限通知----->to空间站管理员
     */
    SPACE_MEMBER_LIMIT("space_member_limit"),
    /**
     * 付费席位数量上限----->to空间站管理员
     */
    SPACE_SEATS_LIMIT("space_seats_limit"),
    /**
     * 空间站记录数已达上限通知----->to空间站管理员
     */
    SPACE_RECORD_LIMIT("space_record_limit"),
    /**
     * API用量已达上限通知----->to空间站管理员
     */
    SPACE_API_LIMIT("space_api_limit"),
    /**
     * 日历视图已达上限通知----->to空间站管理员
     */
    SPACE_CALENDAR_LIMIT("space_calendar_limit"),
    /**
     * 神奇表单已达上限通知----->to空间站管理员
     */
    SPACE_FORM_LIMIT("space_form_limit"),
    /**
     * 甘特视图已达上限通知----->to空间站管理员
     */
    SPACE_GANTT_LIMIT("space_gantt_limit"),
    /**
     * 列权限已达上限通知----->to空间站管理员
     */
    SPACE_FIELD_PERMISSION_LIMIT("space_field_permission_limit"),
    /**
     * 管理员已达上限通知----->to空间站管理员
     */
    SPACE_ADMIN_LIMIT("space_admin_limit"),
    /**
     * 彩虹标签彩色色系使用通知----->to空间站管理员
     */
    SPACE_TIME_MACHINE_LIMIT("space_time_machine_limit"),
    /**
     * 历史文件超限使用通知----->to空间站管理员
     */
    SPACE_TRASH_LIMIT("space_trash_limit"),
    /**
     * 全局水印使用通知----->to空间站管理员
     */
    SPACE_WATERMARK_NOTIFY("space_watermark_notify"),
    /**
     * 甘特视图已达上限通知----->to空间站管理员
     */
    SPACE_YOZOOFFICE_NOTIFY("space_yozooffice_notify"),
    /**
     * 飞书集成使用通知----->to空间站管理员
     */
    SPACE_LARK_NOTIFY("space_lark_notify"),
    /**
     * 钉钉集成使用通知----->to空间站管理员
     */
    SPACE_DINGTALK_NOTIFY("space_dingtalk_notify"),
    /**
     * 企业微信集成使用通知----->to空间站管理员
     */
    SPACE_WECOM_NOTIFY("space_wecom_notify"),

    /**
     * 赠送空间站试用通知----->to空间站管理员
     */
    SPACE_TRIAL("space_trial"),

    /**
     * 空间站开通beta内测功能---->to空间站内除申请者自己
     * */
    APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ALL("apply_space_beta_feature_success_notify_all"),

    /**
     * 空间站开通beta内测功能---->to申请者自己
     * */
    APPLY_SPACE_BETA_FEATURE_SUCCESS_NOTIFY_ME("apply_space_beta_feature_success_notify_me"),

    /**
     * 管理员下架自建小组件通知----->to成员
     */
    ADMIN_UNPUBLISH_SPACE_WIDGET_NOTIFY("admin_unpublish_space_widget_notify"),

    /**
     * 管理员变更自建小组件的发布权通知----->to成员
     */
    ADMIN_TRANSFER_SPACE_WIDGET_NOTIFY("admin_transfer_space_widget_notify"),

    /**
     * 组件中心有新的自建小组件通知----->to主管理员和组件中心子管理员
     */
    NEW_SPACE_WIDGET_NOTIFY("new_space_widget_notify"),

    /**
     * 成功订阅---->to主管理员和子管理员
     */
    SPACE_SUBSCRIPTION_NOTIFY("space_subscription_notify"),
    /**
     * 支付成功公知-->to支付人
     */
    SPACE_PAID_NOTIFY("space_paid_notify"),

    /**
     * 自营付费支付成功通过 --> 支付人
     */
    SPACE_VIKA_PAID_NOTIFY("space_vika_paid_notify"),
    /**
     * 指定用户的系统通知-->to users
     */
    COMMON_SYSTEM_NOTIFY("common_system_notify"),

    /**
     * 指定用户的系统通知-->to users
     */
    COMMON_SYSTEM_NOTIFY_WEB("common_system_notify_web"),

    /**
     * 空间站认证消息-->to users
     */
    SPACE_CERTIFICATION_NOTIFY("space_certification_notify"),

    /**
     * 空间站认证失败消息-->to users
     */
    SPACE_CERTIFICATION_FAIL_NOTIFY("space_certification_fail_notify"),

    /**
     * 活动积分奖励消息-->to users
     */
    ACTIVITY_INTEGRAL_INCOME_NOTIFY("activity_integral_income_notify"),

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

    public static boolean spaceDeleteNotify(NotificationTemplateId templateId) {
        if (ObjectUtil.isNotNull(templateId)) {
            return templateId.equals(SPACE_DELETED);
        }
        return false;
    }
}
