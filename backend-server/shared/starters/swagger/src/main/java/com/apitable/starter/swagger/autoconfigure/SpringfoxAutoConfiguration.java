package com.apitable.starter.swagger.autoconfigure;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

/**
 * autoconfiguration of springfox integration
 *
 * @author Shawn Deng
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
