package com.vikadata.api.modular.social.enums;

/**
 * <p>
 * 企微接口许可账号激活状态
 * </p>
 * @author 刘斌华
 * @date 2022-06-29 17:56:05
 */
public enum SocialCpIsvPermitActivateStatus {

    /**
     * 待激活
     */
    NO_ACTIVATED(1),
    /**
     * 已激活并有效
     */
    ACTIVATED(2),
    /**
     * 已过期
     */
    EXPIRED(3),
    /**
     * 待转移
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
     * 转换来自企微的激活状态值
     *
     * @param status 企微的激活状态值
     * @return 对应的枚举
     * @author 刘斌华
     * @date 2022-07-01 18:58:04
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
