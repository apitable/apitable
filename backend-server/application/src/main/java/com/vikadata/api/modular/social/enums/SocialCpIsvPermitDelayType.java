package com.vikadata.api.modular.social.enums;

/**
 * <p>
 * Delay processing type
 * </p>
 */
public enum SocialCpIsvPermitDelayType {

    /**
     * Interface license free trial expiration notice
     */
    NOTIFY_BEFORE_TRIAL_EXPIRED(1),
    /**
     * Enterprise pays for delayed purchase of interface license
     */
    BUY_AFTER_SUBSCRIPTION_PAID(2),
    ;

    private final int value;

    SocialCpIsvPermitDelayType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

}
