package com.vikadata.api.constants;

/**
 * <p>
 * player通知相关接口定义
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/21 3:51 下午
 */
public class NotificationConstants {
    /**
     * 授权描述
     */
    public static final String BODY_REQUEST_DESC =
            "创建消息接口，body字段说明:{\"extras\":{\"viewId\":\"视图ID\",\"recordIds\":[\"记录ID\", \"记录ID\"], \"toast\": " +
                    "{\"hiddenVikaby\": \"是否显示Vikaby的头像，默认为false\", \"allowPrev\": \"页面出现改toast时，是否需要销毁页面已有的toast，默认为false\", " +
                    "\"duration\": \"自动关闭的延时，单位秒。设为 0 时不自动关闭\", \"msg\": \"消息内容，必传\", \"closable\": \"是否有关闭按钮，默认为false\", " +
                    "\"reloadBtnText\": \" 刷新页面的按钮文字，设置为空字符串或者不传此参数则不显示此按钮\"}}}";

    public static final String BODY_REQUEST_EXAMPLE =
            "{\"extras\":{\"viewId\":\"viwrdXGTaiifG\",\"recordIds\":[\"rec5ckjeq843t\", \"recETGJkQHmbR\"], \"toast\": {\"hiddenVikaby\": false, " +
                    "\"allowPrev\": false, \"duration\": 0, \"msg\": \"富文本消息内容\", \"closable\": false, \"reloadBtnText\": \"点击这里刷新页面\"}}}";

    public static final String BODY_EXTRAS = "extras";

    public static final String URL_HOST_TAG = "host";

    public static final String BODY_EXTRAS_DESC =
            "创建消息接口，body.extras字段说明:{\"viewId\":\"视图ID\",\"recordIds\":[\"记录ID\", \"记录ID\"]}";

    public static final String BODY_EXTRAS_EXAMPLE =
            "{\"viewId\":\"viwrdXGTaiifG\",\"recordIds\":[\"rec5ckjeq843t\", \"recETGJkQHmbR\"]}";

    public static final String TO_MANAGE_MEMBER_RESOURCE_CODE = "MANAGE_MEMBER";

    /**
     * 通知记录提及次数{extras:times}
     */
    public static final String RECORD_MENTION_TIMES = "times";

    /**
     * 通知中消息体中成员的关键字{extras:memberIds}
     */
    public static final String INVOLVE_MEMBER_ID = "involveMemberId";

    /**
     * 通知中消息体中成员的关键字{extras:involveMemberDetail}
     */
    public static final String INVOLVE_MEMBER_DETAIL = "involveMemberDetail";

    /**
     * 通知中消息体中datasheet记录行ID的关键字{extras:recordIds}
     */
    public static final String INVOLVE_RECORD_IDS = "recordIds";

    /**
     * 通知中消息体中空间修改名称关键字{extras:oldSpaceName}
     */
    public static final String OLD_SPACE_NAME = "oldSpaceName";

    /**
     * 通知中消息体中空间修改名称关键字{extras:newSpaceName}
     */
    public static final String NEW_SPACE_NAME = "newSpaceName";

    /**
     * 通知中消息体中分配小组关键字{extras:teamName}
     */
    public static final String TEAM_NAME = "teamName";

    /**
     * 通知中消息体中分配小组关键字{extras:teamId}
     */
    public static final String TEAM_ID = "teamId";

    /**
     * 通知中消息体中空间加入申请ID关键字{extras:applyId}
     */
    public static final String APPLY_ID = "applyId";

    /**
     * 通知中消息体中空间加入申请状态关键字{extras:applyStatus}
     */
    public static final String APPLY_STATUS = "applyStatus";

    /**
     * 通知中消息体中数量关键字{extras:count}
     */
    public static final String COUNT = "count";

    /**
     * 通知中消息体中动作名称关键字{extras:actionName}
     */
    public static final String ACTION_NAME = "actionName";

    /**
     * 通知中消息体中活动名称关键字{extras:activityName}
     */
    public static final String ACTIVITY_NAME = "activityName";

    /**
     * 通知中消息体中客户端版本号关键字{extras:clientVersion}
     */
    public static final String VERSION = "version";

    /**
     * 通知中消息体中过期时间关键字{extras:expireAt}
     */
    public static final String EXPIRE_AT = "expireAt";

    /**
     * 通知中消息体小组件名称关键字{extras:widgetName}
     */
    public static final String WIDGET_NAME = "widgetName";

    /**
     * 通知中消息体中过期时间关键字{extras:planName}
     * 订阅计划名称
     */
    public static final String PLAN_NAME = "planName";

    /**
     * 通知中消息体中支付金额关键字{extras:payFee}
     */
    public static final String PAY_FEE = "payFee";

    /**
     * 通知中消息体中用量键字{extras:specification}
     */
    public static final String SPECIFICATION = "specification";

    /**
     * 通知-邮件-数表名称
     */
    public static final String EMAIL_NODE_NAME = "NODE_NAME";

    /**
     * 通知-邮件-数表跳转连接
     */
    public static final String EMAIL_DATASHEET_URL = "DATASHEET_URL";

    /**
     * 通知-邮件-空间名称
     */
    public static final String EMAIL_SPACE_NAME = "SPACE_NAME";

    /**
     * 通知-邮件-记录ID
     */
    public static final String EMAIL_RECORD_ID = "RECORD_ID";

    /**
     * 通知-邮件-视图ID
     */
    public static final String EMAIL_VIEW_ID = "VIEW_ID";

    /**
     * 通知-邮件-数表记录跳转连接
     */
    public static final String EMAIL_RECORD_URL = "RECORD_URL";

    /**
     * 通知-邮件-发送邮件的人
     */
    public static final String EMAIL_MEMBER_NAME = "MEMBER_NAME";

    /**
     * 通知-邮件-跳转连接，兼容之前的模版
     */
    public static final String EMAIL_URL = "URL";

    /**
     * 通知-邮件-创建时间，兼容之前的模版
     */
    public static final String EMAIL_CREATED_AT = "CREATED_AT";

    /**
     * notification toast
     */
    public static final String EXTRA_TOAST = "toast";

    /**
     * notification toast url
     */
    public static final String EXTRA_TOAST_URL = "url";

    /**
     * the keyword about role in notifications body  {extras:roleName}
     */
    public static final String ROLE_NAME = "roleName";

}
