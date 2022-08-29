package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.FeishuAppProperties.PREFIX;

/**
 *
 * 飞书应用配置
 * @author Shawn Deng
 * @date 2021-01-07 10:43:41
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
