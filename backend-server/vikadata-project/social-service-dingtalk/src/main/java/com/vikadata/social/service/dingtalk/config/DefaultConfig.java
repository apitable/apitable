package com.vikadata.social.service.dingtalk.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * default allocation
 */
@Configuration(proxyBeanMethods = false)
@PropertySource("classpath:/default.properties")
public class DefaultConfig {

}
