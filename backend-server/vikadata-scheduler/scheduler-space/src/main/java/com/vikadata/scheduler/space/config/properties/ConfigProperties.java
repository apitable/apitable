package com.vikadata.scheduler.space.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * Config Properties
 * </p>
 */
@Data
@ConfigurationProperties(prefix = "config")
public class ConfigProperties {

    private String ossBucketName;

    private String ossType;
}
