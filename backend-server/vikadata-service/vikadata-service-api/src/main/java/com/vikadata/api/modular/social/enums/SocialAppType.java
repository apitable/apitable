package com.vikadata.api.modular.social.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 社交媒体平台的应用类型
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/30 17:22
 */
@Getter
@AllArgsConstructor
public enum SocialAppType {

    /**
     * 企业内部应用
     */
    INTERNAL(1),

    /**
     * 独立服务商
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
