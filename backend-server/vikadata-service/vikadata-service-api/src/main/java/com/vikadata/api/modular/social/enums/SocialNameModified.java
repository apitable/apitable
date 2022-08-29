package com.vikadata.api.modular.social.enums;

/**
 * <p>
 * 是否作为第三方 IM 用户修改过昵称
 * </p>
 * @author 刘斌华
 * @date 2022-03-10 10:16:08
 */
public enum SocialNameModified {

    /**
     * 否
     */
    NO(0),
    /**
     * 是
     */
    YES(1),
    /**
     * 不是 IM 第三方用户
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
