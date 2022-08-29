package com.vikadata.api.enums.social;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;

/**
 * 第三方社交软件平台类型
 *
 * @author Shawn Deng
 * @date 2020-12-21 10:58:45
 */
@Getter
@AllArgsConstructor
public enum SocialPlatformType {

    /**
     * 企业微信
     */
    WECOM(1),

    /**
     * 钉钉
     */
    DINGTALK(2),

    /**
     * 飞书
     */
    FEISHU(3);

    private final Integer value;

    public static SocialPlatformType toEnum(Integer type) {
        for (SocialPlatformType e : SocialPlatformType.values()) {
            if (e.getValue().equals(type)) {
                return e;
            }
        }
        throw new BusinessException("未知的第三方帐号关联类型");
    }
}
