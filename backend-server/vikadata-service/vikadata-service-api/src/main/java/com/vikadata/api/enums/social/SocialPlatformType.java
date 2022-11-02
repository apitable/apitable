package com.vikadata.api.enums.social;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;

/**
 * Social platform type
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum SocialPlatformType {

    WECOM(1),

    DINGTALK(2),

    FEISHU(3);

    private final Integer value;

    public static SocialPlatformType toEnum(Integer type) {
        for (SocialPlatformType e : SocialPlatformType.values()) {
            if (e.getValue().equals(type)) {
                return e;
            }
        }
        throw new BusinessException("unknown social platform type");
    }
}
