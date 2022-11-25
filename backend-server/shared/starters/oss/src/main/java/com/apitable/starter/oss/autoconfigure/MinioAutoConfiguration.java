package com.apitable.starter.oss.autoconfigure;

import io.minio.MinioClient;

import com.apitable.starter.oss.autoconfigure.OssProperties.Minio;
import com.apitable.starter.oss.core.OssClientRequestFactory;
import com.apitable.starter.oss.core.minio.MinioOssClientRequestFactory;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(MinioClient.class)
@ConditionalOnProperty(value = "vikadata-starter.oss.type", havingValue = "minio")
public class MinioAutoConfiguration extends OssConnectionConfiguration {

    public MinioAutoConfiguration(OssProperties properties) {
        super(properties);
    }

    @Bean
    @ConditionalOnMissingBean(OssClientRequestFactory.class)
    OssClientRequestFactory ossClientRequestFactory() {
        Minio minio = getProperties().getMinio();
        return new MinioOssClientRequestFactory(minio.getEndpoint(), minio.getAccessKey(), minio.getSecretKey(), minio.getBucketPolicy());
    }
}
