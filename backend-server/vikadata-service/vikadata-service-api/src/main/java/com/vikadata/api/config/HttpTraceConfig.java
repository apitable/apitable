package com.vikadata.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.vikadata.api.component.http.HttpTraceLogRepository;
import com.vikadata.api.component.http.TraceRequestFilter;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Http 追踪链路器配置
 * @author Shawn Deng
 * @date 2021-01-26 16:36:18
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnBean({ HttpTraceLogRepository.class })
public class HttpTraceConfig {

    @Bean
    @ConditionalOnMissingBean
    public TraceRequestFilter traceRequestFilter(HttpTraceLogRepository repository, ObjectMapper objectMapper) {
        return new TraceRequestFilter(repository, objectMapper);
    }
}
