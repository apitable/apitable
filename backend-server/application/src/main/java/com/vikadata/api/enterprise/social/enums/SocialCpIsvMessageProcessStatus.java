package com.vikadata.api.enterprise.social.enums;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider application message notification processing status
 * </p>
 */
public enum SocialCpIsvMessageProcessStatus {

    /**
     * Pending
     */
    PENDING(1),
    /**
     * Processing failed, need to retry
     */
    REJECT_TEMPORARILY(2),
    /**
     * Processing failed, end
     */
    REJECT_PERMANENTLY(3),
    /**
     * Processing succeeded
     */
    SUCCESS(4),
    ;

    private final int value;

    SocialCpIsvMessageProcessStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

}
