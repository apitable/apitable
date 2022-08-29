package com.vikadata.api.modular.social.enums;

/**
 * <p>
 * 延时处理类型
 * </p>
 * @author 刘斌华
 * @date 2022-08-10 18:39:26
 */
public enum SocialCpIsvPermitDelayType {

    /**
     * 接口许可免费试用过期通知
     */
    NOTIFY_BEFORE_TRIAL_EXPIRED(1),
    /**
     * 企业付费延时购买接口许可
     */
    BUY_AFTER_SUBSCRIPTION_PAID(2),
    ;

    private final int value;

    SocialCpIsvPermitDelayType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

}
