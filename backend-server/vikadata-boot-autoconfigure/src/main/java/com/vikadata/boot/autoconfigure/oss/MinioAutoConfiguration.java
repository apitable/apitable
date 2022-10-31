package com.vikadata.boot.autoconfigure.oss;

import io.minio.MinioClient;

import com.vikadata.boot.autoconfigure.oss.OssProperties.Minio;
import com.vikadata.integration.oss.OssClientRequestFactory;
import com.vikadata.integration.oss.minio.MinioOssClientRequestFactory;

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
