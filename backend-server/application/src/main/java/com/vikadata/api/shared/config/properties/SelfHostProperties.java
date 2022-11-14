package com.vikadata.api.shared.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * self-host billing properties
 * @author Shawn Deng
 */
@Data
@ConfigurationProperties(prefix = "vikadata.selfhost")
public class SelfHostProperties {

    private Boolean enabled = false;

    private String expiredAt;
}
