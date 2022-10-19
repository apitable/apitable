package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "vikadata.test")
public class TestProperties {

    private boolean testMode = false;
}
