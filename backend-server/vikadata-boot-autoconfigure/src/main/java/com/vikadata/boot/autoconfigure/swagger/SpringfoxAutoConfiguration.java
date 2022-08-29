package com.vikadata.boot.autoconfigure.swagger;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * Springfox 自动配置
 *
 * @author Shawn Deng
 * @date 2021-01-08 17:41:24
 */
@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(SwaggerProperties.class)
@ConditionalOnProperty(value = "vikadata-starter.swagger.enabled", havingValue = "true")
@Import({
    DocketAutoConfiguration.class,
    SwaggerUiAutoConfiguration.class,
    SwaggerSecurityAutoConfiguration.class
})
public class SpringfoxAutoConfiguration {}
