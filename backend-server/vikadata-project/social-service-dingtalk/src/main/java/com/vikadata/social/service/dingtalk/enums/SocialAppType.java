package com.vikadata.social.service.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Types of apps for social media platforms
 */
@Getter
@AllArgsConstructor
public enum SocialAppType {

    /**
     * internal application
     */
    INTERNAL(1),

    /**
     * isv
     */
    ISV(2);

    private final int type;

    public static SocialAppType of(int value) {
        for (SocialAppType socialAppType : SocialAppType.values()) {
            if (socialAppType.type == value) {
                return socialAppType;
            }
        }
        throw new IllegalStateException("UNKNOWN APP TYPE");
    }
}
