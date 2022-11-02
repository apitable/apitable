package com.vikadata.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * default properties
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@PropertySource("classpath:/default.properties")
public class DefaultConfig {

}
