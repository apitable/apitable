package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.LogPathProperties.PREFIX;

/**
 * <p>
 * 日志路径配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/15 11:06
 */
@Data
@ConfigurationProperties(prefix = PREFIX)
public class LogPathProperties {

    public static final String PREFIX = "vikadata.log";

    private static final String DEFAULT_PATH = "/logs";

    private String path = DEFAULT_PATH;
}
