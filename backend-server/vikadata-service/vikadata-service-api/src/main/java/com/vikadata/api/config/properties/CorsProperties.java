package com.vikadata.api.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

import static com.vikadata.api.config.properties.CorsProperties.PREFIX;

/**
 * <p>
 * 跨域 配置信息
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/28 20:40
 */
@Data
@ConfigurationProperties(prefix= PREFIX)
public class CorsProperties {

    public static final String PREFIX = "vikadata.cors";

    private String[] origins;

    private String[] allowHeaders;

    private String[] allowMethods;
}
