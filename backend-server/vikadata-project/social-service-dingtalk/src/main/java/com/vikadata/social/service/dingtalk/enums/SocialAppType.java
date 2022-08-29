package com.vikadata.social.service.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p> 
 * 社交媒体平台的应用类型
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/10 5:35 下午
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
        throw new IllegalStateException("未知的应用类型");
    }
}
