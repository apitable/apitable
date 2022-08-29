package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Shawn Deng
 * @date 2021-01-05 22:07:08
 */
@Data
@ConfigurationProperties(prefix = WxProperties.PREFIX)
public class WxProperties {

    public static final String PREFIX = "vikadata.wx";

    private String openRedirectUri;
}
