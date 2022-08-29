package com.vikadata.scheduler.space.config.properties;

import lombok.Data;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * 常量配置信息
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/03/28
 */
@Data
@ConfigurationProperties(prefix = "config")
public class ConfigProperties {

    /**
     * oss存储桶名称
     */
    private String ossBucketName;

    /**
     * 存储类型
     */
    private String ossType;
}
