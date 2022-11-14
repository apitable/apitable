package com.vikadata.api.enterprise.social.enums;

/**
 * <p>
 * Whether the nickname has been modified as a third-party IM user
 * </p>
 */
public enum SocialNameModified {
    NO(0),

    YES(1),

    /**
     * Not an IM third-party user
     */
    NO_SOCIAL(2),

    ;

    private final int value;

    SocialNameModified(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }

}
