package com.vikadata.api.shared.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.shared.config.properties.FeishuAppProperties.PREFIX;

/**
 * feishu app properties
 * @author Shawn Deng
 */
@Data
@ConfigurationProperties(prefix = PREFIX)
public class FeishuAppProperties {

    public static final String PREFIX = "vikadata.feishu.app";

    private String adminUri;

    private String errorUri;

    private Boolean v2Enable = Boolean.FALSE;

    private String helpUri;

    private String helpDeskUri;
}
