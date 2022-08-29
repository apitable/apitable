package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 订阅配置
 * @author Shawn Deng
 * @date 2022-02-21 19:43:54
 */
@Data
@ConfigurationProperties(prefix = "vikadata.subscription")
public class SubscriptionProperties {

    private Boolean testMode = false;
}
