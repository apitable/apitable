package com.vikadata.social.wecom.constants;

import java.util.Objects;

/**
 * <p>
 * 企业微信第三方服务商应用消息通知信息类型
 * </p>
 * @author 刘斌华
 * @date 2022-01-05 17:11:14
 */
public enum WeComIsvMessageType {

    /**
     * 应用授权成功
     */
    AUTH_CREATE(1, "create_auth"),
    /**
     * 应用变更授权
     */
    AUTH_CHANGE(2, "change_auth"),
    /**
     * 应用取消授权
     */
    AUTH_CANCEL(3, "cancel_auth"),

    /**
     * 第三方服务 suite_ticket
     */
    SUITE_TICKET(11, "suite_ticket"),

    /**
     * 应用变更成员
     */
    CONTACT_CHANGE(21, "change_contact"),

    /**
     * 下单成功
     */
    OPEN_ORDER(51, "open_order"),
    /**
     * 改单
     */
    CHANGE_ORDER(53, "change_order"),
    /**
     * 支付成功
     */
    PAY_FOR_APP_SUCCESS(56, "pay_for_app_success"),
    /**
     * 退款
     */
    REFUND(57, "refund"),
    /**
     * 应用版本变更
     */
    CHANGE_EDITION(58, "change_editon"),

    /**
     * 应用管理员变更
     */
    CHANGE_APP_ADMIN(101, "change_app_admin"),

    /**
     * 成员关注
     */
    SUBSCRIBE(111, "subscribe"),
    /**
     * 成员取消关注
     */
    UNSUBSCRIBE(112, "unsubscribe"),

    /**
     * 通过安装维格表的授权链接完成应用安装。非企业微信的事件通知，这里只是用于 MQ 异步处理
     */
    INSTALL_SELF_AUTH_CREATE(201, "install_self_auth_create"),

    /**
     * 接口许可支付成功
     */
    LICENSE_PAY_SUCCESS(211, "license_pay_success"),

    /**
     * 接口许可退款结果
     */
    LICENSE_REFUND(212, "license_refund");

    private final int type;

    private final String infoType;

    WeComIsvMessageType(int type, String infoType) {
        this.type = type;
        this.infoType = infoType;
    }

    public int getType() {
        return type;
    }

    public String getInfoType() {
        return infoType;
    }

    public static WeComIsvMessageType fromType(Integer type) {

        Objects.requireNonNull(type, "Type value cannot be null.");

        for (WeComIsvMessageType value : values()) {
            if (value.getType() == type) {
                return value;
            }
        }

        throw new IllegalArgumentException("Unsupported type value: " + type);

    }

}
