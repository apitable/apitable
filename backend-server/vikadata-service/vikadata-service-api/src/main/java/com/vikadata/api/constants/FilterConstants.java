package com.vikadata.api.constants;

import org.springframework.core.Ordered;

/**
 * <p>
 * 过滤器链
 * 减数越大，越靠后执行
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/6/11 18:26
 */
public class FilterConstants {

    /**
     * 间隔顺序
     */
    private static final int INTERVAL = 2;

    /**
     * 业务系统优先级第一的过滤器执行顺序
     */
    public static final int FIRST_ORDERED = Ordered.LOWEST_PRECEDENCE - 99;

    /**
     * Logback 日志 MDC 过滤器
     */
    public static final int MDC_INSERTING_SERVLET_FILTER = FIRST_ORDERED + INTERVAL;

    /**
     * 链路追踪初始化过滤器
     */
    public static final int SLEUTH_TRACE_FILTER = FIRST_ORDERED + INTERVAL * 2;

    /**
     * 业务请求线程的线程变量过滤器
     */
    public static final int REQUEST_THREAD_HOLDER_FILTER = FIRST_ORDERED + INTERVAL * 3;

    /**
     * 请求审计记录过滤器
     */
    public static final int TRACE_REQUEST_FILTER = FIRST_ORDERED + INTERVAL * 4;

    /**
     * api key 过滤器
     */
    public static final int API_KEY_SECURITY_FILTER = FIRST_ORDERED + INTERVAL * 5;

    /**
     * api 资源过滤器
     */
    public static final int API_RESOURCE_SECURITY_FILTER = FIRST_ORDERED + INTERVAL * 6;
}
