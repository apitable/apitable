package com.vikadata.api.config;

import brave.http.HttpRequestParser;

import org.springframework.cloud.sleuth.instrument.web.HttpClientRequestParser;
import org.springframework.cloud.sleuth.instrument.web.HttpServerRequestParser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 追踪配置
 * @author Shawn Deng
 * @date 2021-01-28 17:06:24
 */
@Configuration(proxyBeanMethods = false)
public class SleuthConfig {

    @Bean(name = { HttpClientRequestParser.NAME, HttpServerRequestParser.NAME})
    HttpRequestParser sleuthHttpServerRequestParser() {
        return (req, context, span) -> {
            HttpRequestParser.DEFAULT.parse(req, context, span);
            String url = req.url();
            if (url != null) {
                span.tag("http.url", url);
            }
        };
    }
}
