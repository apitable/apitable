package com.vikadata.boot.autoconfigure.spring;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring FrameWork 工具包配置
 *
 * @author Shawn Deng
 * @date 2021-01-05 16:45:19
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication
public class SpringToolkitAutoConfiguration {

    /**
     * Spring容器上下文
     *
     * @author Shawn Deng
     * @date 2018/10/25 01:19
     */
    @Bean
    @ConditionalOnMissingBean
    public SpringContextHolder springContextHolder() {
        return new SpringContextHolder();
    }
}
