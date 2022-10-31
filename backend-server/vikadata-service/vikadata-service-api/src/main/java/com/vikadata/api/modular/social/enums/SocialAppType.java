package com.vikadata.api.modular.social.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * Application type of social media platform
 * </p>
 */
@Getter
@AllArgsConstructor
public enum SocialAppType {

    /**
     * Enterprise internal application
     */
    INTERNAL(1),

    /**
     * Independent service provider
     */
    ISV(2);

    private final int type;

    public static SocialAppType of(int value) {
        for (SocialAppType socialAppType : SocialAppType.values()) {
            if (socialAppType.type == value) {
                return socialAppType;
            }
        }
        return null;
    }
}
