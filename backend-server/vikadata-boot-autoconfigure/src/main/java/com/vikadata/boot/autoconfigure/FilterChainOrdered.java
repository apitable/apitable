package com.vikadata.boot.autoconfigure;

import org.springframework.core.Ordered;

/**
 * 组件内所有的过滤器执行顺序
 * 当boot autoconfigure 组件内引入时，必须在SpringBoot Application业务系统的自定义过滤器的前面，
 * 默认以 Ordered.LOWEST_PRECEDENCE 减去 100开始，让业务系统可以添加至少100个过滤器，然后执行在其前面
 * @author Shawn Deng
 * @date 2021-06-30 18:40:50
 */
public class FilterChainOrdered {

    public static final int MIDUN_CAS_FILTER = Ordered.LOWEST_PRECEDENCE - 100;
}
