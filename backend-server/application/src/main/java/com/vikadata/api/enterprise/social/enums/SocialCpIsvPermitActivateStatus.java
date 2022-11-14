package com.vikadata.api.enterprise.social.enums;

/**
 * <p>
 * WeCom interface license account activation status
 * </p>
 */
public enum SocialCpIsvPermitActivateStatus {

    /**
     * To be activated
     */
    NO_ACTIVATED(1),
    /**
     * Active and valid
     */
    ACTIVATED(2),
    /**
     * Expired
     */
    EXPIRED(3),
    /**
     * To be transferred
     */
    TRANSFERRED(4),
    ;

    private final int value;

    SocialCpIsvPermitActivateStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    /**
     * Convert the activation status value from WeCom
     *
     * @param status WeCom activation status value
     * @return Corresponding enumeration
     */
    public static SocialCpIsvPermitActivateStatus fromWecomStatus(Integer status) {
        switch (status) {
            case 1:
                return NO_ACTIVATED;
            case 2:
                return ACTIVATED;
            case 3:
                return EXPIRED;
            case 4:
                return TRANSFERRED;
            default:
                throw new IllegalArgumentException("Unsupported status value: " + status);
        }
    }

}
