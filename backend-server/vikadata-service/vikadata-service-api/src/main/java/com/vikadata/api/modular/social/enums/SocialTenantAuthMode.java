package com.vikadata.api.modular.social.enums;

import java.util.Objects;

/**
 * <p>
 * Third party platform authorization mode
 * </p>
 */
public enum SocialTenantAuthMode {

    /**
     * Enterprise administrator authorization
     */
    ADMIN(1),
    /**
     * Member Authorization
     */
    MEMBER(2),
    ;

    private final int value;

    SocialTenantAuthMode(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    /**
     * Convert the authorization mode value defined by WeCom to the current enumeration
     *
     * @param authMode Value of authorization mode defined by WeCom
     * @return {@link SocialTenantAuthMode}
     * @throws IllegalArgumentException The parameter is {@code null} or invalid value
     */
    public static SocialTenantAuthMode fromWeCom(Integer authMode) {

        Objects.requireNonNull(authMode, "Auth mode from WeCom cannot be null.");

        if (authMode == 0) {
            return ADMIN;
        } else if (authMode == 1) {
            return MEMBER;
        }

        throw new IllegalArgumentException("Unsupported auth mode from WeCom: " + authMode);

    }

}
