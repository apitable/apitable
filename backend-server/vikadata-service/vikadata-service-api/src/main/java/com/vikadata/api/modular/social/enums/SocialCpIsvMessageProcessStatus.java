package com.vikadata.api.modular.social.enums;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用消息通知处理状态
 * </p>
 * @author 刘斌华
 * @date 2022-01-17 16:06:36
 */
public enum SocialCpIsvMessageProcessStatus {

    /**
     * 待处理
     */
    PENDING(1),
    /**
     * 处理失败，需要重试
     */
    REJECT_TEMPORARILY(2),
    /**
     * 处理失败，结束
     */
    REJECT_PERMANENTLY(3),
    /**
     * 处理成功
     */
    SUCCESS(4),
    ;

    private final int value;

    SocialCpIsvMessageProcessStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

}
