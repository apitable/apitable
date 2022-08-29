package com.vikadata.api.modular.social.enums;

/**
 * <p>
 * 企微服务商接口许可延时任务处理状态
 * </p>
 * @author 刘斌华
 * @date 2022-07-19 14:11:42
 */
public enum SocialCpIsvPermitDelayProcessStatus {

    /**
     * 待处理
     */
    PENDING(0),
    /**
     * 已发送到队列
     */
    QUEUED(1),
    /**
     * 已下单
     */
    ORDER_CREATED(5),
    /**
     * 已完成
     */
    FINISHED(9),
    ;

    private final int value;

    SocialCpIsvPermitDelayProcessStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    /**
     * 将值转换为枚举
     *
     * @param statusValue 值
     * @return 对应的枚举
     * @author 刘斌华
     * @date 2022-07-19 15:55:41
     */
    public static SocialCpIsvPermitDelayProcessStatus fromStatusValue(Integer statusValue) {
        switch (statusValue) {
            case 0:
                return PENDING;
            case 1:
                return QUEUED;
            case 5:
                return ORDER_CREATED;
            case 9:
                return FINISHED;
            default:
                throw new IllegalArgumentException("Unsupported status value: " + statusValue);
        }
    }

}
