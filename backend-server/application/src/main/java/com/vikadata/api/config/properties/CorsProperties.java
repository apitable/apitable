package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.CorsProperties.PREFIX;

/**
 * <p>
 * cross origin properties
 * </p>
 *
 * @author Shawn Deng
 */
@Data
@ConfigurationProperties(prefix= PREFIX)
public class CorsProperties {

    public static final String PREFIX = "vikadata.cors";

    private String[] origins;

    private String[] allowHeaders;

    private String[] allowMethods;
}
