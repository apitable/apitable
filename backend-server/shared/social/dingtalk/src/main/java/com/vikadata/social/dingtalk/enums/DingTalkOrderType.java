package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * order type
 */
@Getter
@AllArgsConstructor
public enum DingTalkOrderType {
    /**
     * new purchase
     */
    BUY("BUY"),

    /**
     * renewal
     */
    RENEW("RENEW"),

    /**
     * upgrade
     */
    UPGRADE("UPGRADE"),

    /**
     * renewal and upgrade
     */
    RENEW_UPGRADE("RENEW_UPGRADE"),
    
    /**
     * Renewal and downgrade
     */
    RENEW_DEGRADE("RENEW_DEGRADE");

    private final String value;

    public String getValue(String value) {
        return this.value;
    }

}
