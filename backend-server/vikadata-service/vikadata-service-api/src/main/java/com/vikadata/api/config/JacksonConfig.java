package com.vikadata.api.config;

import com.fasterxml.jackson.core.JsonParser;

import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * <p>
 * Jackson 配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/29 20:10
 */
@Configuration(proxyBeanMethods = false)
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
        return builder -> {
            builder.failOnEmptyBeans(false);
            builder.failOnUnknownProperties(false);
            builder.featuresToEnable(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS);
        };
    }
}
