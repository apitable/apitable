package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.LogPathProperties.PREFIX;

/**
 * <p>
 * log properties
 * </p>
 *
 * @author Shawn Deng
 */
@Data
@ConfigurationProperties(prefix = PREFIX)
public class LogPathProperties {

    public static final String PREFIX = "vikadata.log";

    private static final String DEFAULT_PATH = "/logs";

    private String path = DEFAULT_PATH;
}
