package com.vikadata.social.wecom.constants;

import java.util.Objects;

/**
 * Enterprise WeChat isv application message notification information type
 */
public enum WeComIsvMessageType {

    /**
     * App authorization succeeded
     */
    AUTH_CREATE(1, "create_auth"),
    /**
     * Apply change Authorization
     */
    AUTH_CHANGE(2, "change_auth"),
    /**
     * App cancel authorization
     */
    AUTH_CANCEL(3, "cancel_auth"),

    /**
     * Isv suite_ticket
     */
    SUITE_TICKET(11, "suite_ticket"),

    /**
     * Change membership
     */
    CONTACT_CHANGE(21, "change_contact"),

    /**
     * Successfully ordered
     */
    OPEN_ORDER(51, "open_order"),
    /**
     * Change the order
     */
    CHANGE_ORDER(53, "change_order"),
    /**
     * Payment successful
     */
    PAY_FOR_APP_SUCCESS(56, "pay_for_app_success"),
    /**
     * Refund
     */
    REFUND(57, "refund"),
    /**
     * App edition changes
     */
    CHANGE_EDITION(58, "change_editon"),

    /**
     * Admin changes
     */
    CHANGE_APP_ADMIN(101, "change_app_admin"),

    /**
     * Members follow
     */
    SUBSCRIBE(111, "subscribe"),
    /**
     * Member unfollows
     */
    UNSUBSCRIBE(112, "unsubscribe"),

    /**
     * install app by member
     */
    INSTALL_SELF_AUTH_CREATE(201, "install_self_auth_create"),

    /**
     * Interface license payment successful
     */
    LICENSE_PAY_SUCCESS(211, "license_pay_success"),

    /**
     * Interface license refund result
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
