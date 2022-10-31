package com.vikadata.social.service.dingtalk.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = ConstProperties.PREFIX_CONST)
public class ConstProperties {

    public static final String PREFIX_CONST = "vikadata.social.const";

    private VikaApi vikaApi;

    public String getVikaApiUrl() {
        return vikaApi.getHost() + vikaApi.getBasePath();
    }

    @Getter
    @Setter
    public static class VikaApi {
        private String host;

        private String basePath;
    }
}
