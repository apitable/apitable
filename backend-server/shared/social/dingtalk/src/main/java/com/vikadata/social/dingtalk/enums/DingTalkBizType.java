package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * DingTalk Subscription Event--Data Format Type
 */
@Getter
@AllArgsConstructor
public enum DingTalkBizType {
    /**
     * Suite Ticket latest status
     */
    SUITE_TICKET_EVENT(2),

    /**
     * The latest status of industry-licensed applications
     */
    ORG_SUITE_AUTH(4),
    /**
     * The latest state of enterprise microapps
     */
    ORG_MICRO_APP_RESTORE(7),
    /**
     *
     * The latest status of enterprise employees
     */
    ORG_USER_RESTORE(13),
    /**
     * The latest status of the corporate sector
     */
    ORG_DEPT_RESTORE(14),
    /**
     * The latest status of the business
     */
    ORG_CREATE(16),
    /**
     * In-app purchase order
     */
    MARKET_ORDER(17),
    /**
     * The data is the service shutdown data due to order expiration or refund
     */
    SUBSCRIPTION_CLOSE(37);

    private final Integer value;

    public Integer getValue() {
        return value;
    }

    public static DingTalkBizType toEnum(Integer value) {
        for (DingTalkBizType item : DingTalkBizType.values()) {
            if (item.value.equals(value)) {
                return item;
            }
        }
        return null;
    }

    public static boolean hasValue(Integer value) {
        for (DingTalkBizType item : DingTalkBizType.values()) {
            if (item.value.equals(value)) {
                return true;
            }
        }
        return false;
    }

}
