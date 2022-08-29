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
public enum DingTalkSubscriptionPeriodType {

    /**
     * 两年
     */
    BIENNIAL("BIENNIAL"),

    /**
     * 一年
     */
    ANNUAL("ANNUAL"),

    /**
     * 一个月
     */
    MONTHLY("MONTHLY"),
    /**
     * 钉钉免费规格的版本
     */
    NO_BILLING_PERIOD("NO_BILLING_PERIOD");

    private String name;

    public String getValue() {
        return this.name;
    }

    public static DingTalkSubscriptionPeriodType getType(String name) {
        for (DingTalkSubscriptionPeriodType type : DingTalkSubscriptionPeriodType.values()) {
            if (type.getValue().equals(name)) {
                return type;
            }
        }
        return null;
    }
}
