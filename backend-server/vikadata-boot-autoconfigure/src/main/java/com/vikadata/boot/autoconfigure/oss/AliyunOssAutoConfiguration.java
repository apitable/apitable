package com.vikadata.boot.autoconfigure.oss;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

/**
 * 阿里云OSS存储自动配置
 * @author Shawn Deng
 * @date 2021-01-05 11:40:05
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(value = "vikadata-starter.oss.type", havingValue = "aliyun")
public class AliyunOssAutoConfiguration extends OssConnectionConfiguration {

    AliyunOssAutoConfiguration(OssProperties properties) {
        super(properties);
    }
}
