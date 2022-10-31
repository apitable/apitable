package com.vikadata.social.service.dingtalk.config;

import com.vikadata.social.service.dingtalk.exception.DingTalkApiLimitException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.support.RetryTemplate;

@Configuration(proxyBeanMethods = false)
public class RetryTemplateConfig {

    @Bean
    public RetryTemplate retryTemplate() {
        // up to 1 minute
        return RetryTemplate.builder().maxAttempts(6)
                .exponentialBackoff(1000, 2, 60000)
                .retryOn(DingTalkApiLimitException.class)
                .build();
    }
}
