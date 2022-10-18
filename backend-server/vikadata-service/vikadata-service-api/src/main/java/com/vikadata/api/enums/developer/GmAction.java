package com.vikadata.api.enums.developer;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * GM Action
 * </p>
 *
 * @author Chambers
 * @date 2022/6/22
 */
@Getter
@AllArgsConstructor
public enum GmAction {

    /**
     * GM权限配置
     */
    PERMISSION_CONFIG,

    /**
     * 模板中心配置
     */
    TEMPLATE_CENTER_CONFIG,

    /**
     * 模板资源标志
     */
    TEMPLATE_ASSET_MARK,

    /**
     * 引导配置
     */
    WIZARD_CONFIG,

    /**
     * 发布系统通知
     */
    SYSTEM_NOTIFICATION_PUBLISH,

    /**
     * 撤销系统通知
     */
    SYSTEM_NOTIFICATION_REVOKE,

    /**
     * 创建实验室功能
     */
    LAB_FEATURE_CREATE,

    /**
     * 修改实验室功能
     */
    LAB_FEATURE_EDIT,

    /**
     * 删除实验室功能
     */
    LAB_FEATURE_DELETE,

    /**
     * 指定用户的活动状态
     */
    USER_ACTIVITY_ASSIGN,

    /**
     * 重置用户的活动状态
     */
    USER_ACTIVITY_RESET,

    /**
     * 测试验证码
     */
    TEST_CAPTCHA,

    /**
     * 创建测试帐号
     */
    TEST_ACCOUNT_CREATE,

    /**
     * 关闭注销冷静期账号
     */
    PAUSED_ACCOUNT_CLOSE,

    /**
     * 帐号封禁
     */
    ACCOUNT_BAN,

    /**
     * 空间封禁
     */
    SPACE_BAN,

    /**
     * 空间黑名单设置
     */
    BLACK_SPACE_SET,

    /**
     * 空间站认证
     */
    SPACE_CERTIFY,

    /**
     * 飞书事件补偿
     */
    FEISHU_EVENT_COMPENSATE,

    /**
     * 验证锁定
     */
    VALIDATION_LOCK,

    /**
     * 验证解锁
     */
    VALIDATION_UNLOCK,

    /**
     * 小程序管理
     */
    WIDGET_MANAGE,

    /**
     * 小程序封禁
     */
    WIDGET_BAN,

    /**
     * 小程序解封
     */
    WIDGET_UNBAN,

    /**
     * 订阅系统订单创建
     */
    BILLING_ORDER_CREATE,

    /**
     * 订阅系统订单查询
     */
    BILLING_ORDER_QUERY,

    /**
     * V码查询
     */
    V_CODE_QUERY,

    /**
     * V码管理
     */
    V_CODE_MANAGE,

    /**
     * V码兑换券模板查询
     */
    V_CODE_COUPON_QUERY,

    /**
     * V码兑换券模板管理
     */
    V_CODE_COUPON_MANAGE,

    /**
     * （V码）活动查询
     */
    ACTIVITY_QUERY,

    /**
     * （V码）活动管理
     */
    ACTIVITY_MANAGE,

    /**
     * 微信公众号二维码查询
     */
    WECHAT_QRCODE_QUERY,

    /**
     * 微信公众号二维码管理
     */
    WECHAT_QRCODE__MANAGE,

    /**
     * 更新微信关键词自动回复规则
     */
    WECHAT_REPLY_RULE_REFRESH,

    /**
     * （活动）积分奖励
     */
    INTEGRAL_REWARD,

    /**
     * 查询用户积分
     */
    INTEGRAL_QUERY,

    /**
     * 扣除用户积分
     */
    INTEGRAL_SUBTRACT,

    /**
     * 手动执行企微服务商事件
     */
    WECOM_ISV_EVENT,

    /**
     * 为手动删除了空间站的企微服务商重新创建空间站
     */
    WECOM_ISV_NEW_SPACE,

    /**
     * Migrate wecom isv orders to billing
     */
    WECOM_ISV_ORDER_MIGRATE,

    /**
     * 企微服务商下单购买接口许可
     */
    WECOM_ISV_PERMIT_NEW_ORDER,

    /**
     * 企微服务商激活接口许可
     */
    WECOM_ISV_PERMIT_ACTIVATE,

    /**
     * 企微服务商下单续期接口许可
     */
    WECOM_ISV_PERMIT_RENEWAL,

    /**
     * 企微服务商确认订单及其企业下所有账号的最新信息
     */
    WECOM_ISV_PERMIT_ENSURE_ALL,

    /**
     * query user mobile phone and email by user's id
     */
    CONTACT_INFO_QUERY,

    ;
}
