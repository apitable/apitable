package com.vikadata.api.constants;

/**
 * <p>
 * AOP 执行顺序
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/18 19:07
 */
public class AspectOrderConstants {

    /**
     * Controller 请求上下文打印
     */
    public static final int CHAIN_ON_REQUEST_LOGGING_ORDER = 100;

    /**
     * 数表权限校验AOP
     */
    public static final int CHAIN_ON_ENDPOINT_ORDER = 101;

    /**
     * 订阅功能点AOP
     */
    public static final int CHAIN_ON_SUBSCRIBE_ENDPOINT_ORDER = 102;

    /**
     * 通知AOP
     */
    public static final int CHAIN_ON_AUDIT_NOTIFICATION_ORDER = 103;

    /**
     * 审计AOP
     */
    public static final int CHAIN_ON_AUDIT_ACTION_ORDER = 104;

    /**
     * 切换企业微信配置AOP
     */
    public static final int CHAIN_ON_WECOM_SWITCHOVER_ORDER = 105;

    /**
     * 灰度配置自动切换AOP
     */
    public static final int CHAIN_ON_GRAY_CONFIG_ORDER = 106;
}
