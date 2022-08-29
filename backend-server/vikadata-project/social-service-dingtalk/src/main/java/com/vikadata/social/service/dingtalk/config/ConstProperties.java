package com.vikadata.social.service.dingtalk.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * 常量配置信息
 * </p>
 *
 * @author Chambers
 * @date 2020/1/2
 */
@Data
@ConfigurationProperties(prefix = ConstProperties.PREFIX_CONST)
public class ConstProperties {

    public static final String PREFIX_CONST = "vikadata.social.const";

    private VikaApi vikaApi;

    @Getter
    @Setter
    public static class VikaApi {
        private String host;

        private String basePath;
    }

    public String getVikaApiUrl() {
        return vikaApi.getHost() + vikaApi.getBasePath();
    }
}
