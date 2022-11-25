package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Order charge type (for trial specification only)
 */
@Getter
@AllArgsConstructor
public enum DingTalkOrderChargeType {

    /**
     * Open for free
     */
    FREE("FREE"),

    /**
     * Trial activation
     */
    TRYOUT("TRYOUT");

    private final String value;

    public String getValue() {
        return this.value;
    }

}
