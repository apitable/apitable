package com.vikadata.api.enterprise.billing.enums;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum DingTalkOrderType {

    BUY("新购"),

    RENEW("续费"),

    UPGRADE("升级"),

    RENEW_UPGRADE("续费升配"),

    RENEW_DEGRADE("续费降配"),

    UPGRADE_CLOSED("升级关闭"),

    DUE_CLOSE("到期关闭"),

    REFUND_CLOSE("退款关闭"),

    OTHER_CLOSE("其他关闭");

    private final String name;

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
