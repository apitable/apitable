package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 私有化配置
 * @author Shawn Deng
 * @date 2022-03-29 01:01:59
 */
@Data
@ConfigurationProperties(prefix = "vikadata.selfhost")
public class SelfHostProperties {

    private Boolean enabled = false;

    private String expiredAt;
}
