package com.vikadata.api.enums.finance;

import lombok.AllArgsConstructor;

/**
 * <p>
 * 订阅类型
 * </p>
 *
 * @author Chambers
 * @date 2021/10/26
 */
@AllArgsConstructor
public enum DingTalkSubscriptionType {
    /**
     * 钉钉免费试用
     */
    DINGTALK_BASIC("Dingtalk_Basic"),

    /**
     * 钉钉标准版
     */
    DINGTALK_STANDARD("Dingtalk_Standard"),

    /**
     * 钉钉企业版
     */
    DINGTALK_ENTERPRISE("Dingtalk_Enterprise"),

    /**
     * 钉钉基础版
     */
    DINGTALK_BASE("Dingtalk_Base");

    private String name;

    public String getValue() {
        return this.name;
    }

    public static DingTalkSubscriptionType getType(String name) {
        for (DingTalkSubscriptionType type : DingTalkSubscriptionType.values()) {
            if (type.getValue().equals(name)) {
                return type;
            }
        }
        return null;
    }
}
