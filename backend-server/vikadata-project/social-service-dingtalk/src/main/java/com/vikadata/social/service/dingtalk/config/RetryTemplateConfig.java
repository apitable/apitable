package com.vikadata.social.service.dingtalk.config;

import com.vikadata.social.service.dingtalk.exception.DingTalkApiLimitException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.support.RetryTemplate;

/**
 * <p> 
 * RetryTemplate 配置
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/10 4:20 下午
 */
@Configuration(proxyBeanMethods = false)
public class RetryTemplateConfig {

    @Bean
    public RetryTemplate retryTemplate() {
        // 最长1分钟
        return RetryTemplate.builder().maxAttempts(6)
                .exponentialBackoff(1000, 2, 60000)
                .retryOn(DingTalkApiLimitException.class)
                .build();
    }
}
