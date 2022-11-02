package com.vikadata.api.modular.social.enums;

/**
 * <p>
 * WeCom service provider interface permission delay task processing status
 * </p>
 */
public enum SocialCpIsvPermitDelayProcessStatus {

    /**
     * Pending
     */
    PENDING(0),
    /**
     * Sent to queue
     */
    QUEUED(1),
    /**
     * Ordered
     */
    ORDER_CREATED(5),
    /**
     * Completed
     */
    FINISHED(9),
    ;

    private final int value;

    SocialCpIsvPermitDelayProcessStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    /**
     * Convert Value to Enum
     *
     * @param statusValue value
     * @return Corresponding enumeration
     */
    public static SocialCpIsvPermitDelayProcessStatus fromStatusValue(Integer statusValue) {
        switch (statusValue) {
            case 0:
                return PENDING;
            case 1:
                return QUEUED;
            case 5:
                return ORDER_CREATED;
            case 9:
                return FINISHED;
            default:
                throw new IllegalArgumentException("Unsupported status value: " + statusValue);
        }
    }

}
