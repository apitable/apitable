package com.vikadata.api.enums.finance;

import lombok.AllArgsConstructor;

/**
 * <p>
 * 订单类型
 * </p>
 *
 * @author Chambers
 * @date 2021/10/27
 */
@AllArgsConstructor
public enum DingTalkOrderType {

    /**
     * 新购
     */
    BUY("新购"),

    /**
     * 续费
     */
    RENEW("续费"),

    /**
     * 升级
     */
    UPGRADE("升级"),

    /**
     * 续费升配
     */
    RENEW_UPGRADE("续费升配"),

    /**
     * 续费降配
     */
    RENEW_DEGRADE("续费降配"),

    /**
     * 升级关闭
     */
    UPGRADE_CLOSED("升级关闭"),

    /**
     * 到期关闭
     */
    DUE_CLOSE("到期关闭"),

    /**
     * 退款关闭
     */
    REFUND_CLOSE("退款关闭"),

    /**
     * 其他关闭
     */
    OTHER_CLOSE("其他关闭");

    private String name;

    public String getValue() {
        return this.name;
    }

    public static DingTalkOrderType getType(String name) {
        for (DingTalkOrderType type : DingTalkOrderType.values()) {
            if (type.getValue().equals(name)) {
                return type;
            }
        }
        return null;
    }
}
