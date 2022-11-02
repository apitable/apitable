package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = WxProperties.PREFIX)
public class WxProperties {

    public static final String PREFIX = "vikadata.wx";

    private String openRedirectUri;
}
