package com.vikadata.api.modular.social.enums;

import java.util.Objects;

/**
 * <p>
 * 第三方平台授权模式
 * </p>
 * @author 刘斌华
 * @date 2022-01-06 16:23:37
 */
public enum SocialTenantAuthMode {

    /**
     * 企业管理员授权
     */
    ADMIN(1),
    /**
     * 成员授权
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
     * 将企业微信定义的授权模式取值转换为当前枚举
     *
     * @param authMode 企业微信定义的授权模式取值
     * @return {@link SocialTenantAuthMode}
     * @throws IllegalArgumentException 参数为 {@code null} 或者无效值
     * @author 刘斌华
     * @date 2022-01-06 16:39:19
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
