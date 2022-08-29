package com.vikadata.social.service.dingtalk.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * 默认配置
 * @author Shawn Deng
 * @date 2021-06-29 18:37:11
 */
@Configuration(proxyBeanMethods = false)
@PropertySource("classpath:/default.properties")
public class DefaultConfig {

}
