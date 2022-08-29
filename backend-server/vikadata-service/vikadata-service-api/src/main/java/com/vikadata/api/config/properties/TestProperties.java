package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 *
 * @author Shawn Deng
 * @date 2022-05-25 16:37:19
 */
@Data
@ConfigurationProperties(prefix = "vikadata.test")
public class TestProperties {

    private boolean testMode = false;
}
