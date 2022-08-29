package com.vikadata.boot.autoconfigure.oss;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.s3.AmazonS3;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.boot.autoconfigure.oss.OssProperties.Aws;
import com.vikadata.integration.oss.aws.AwsS3OssClientRequestFactory;
import com.vikadata.integration.oss.OssClientRequestFactory;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 亚马逊云S3存储自动配置
 *
 * @author Shawn Deng
 * @date 2021-01-05 11:26:17
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(AmazonS3.class)
@ConditionalOnProperty(value = "vikadata-starter.oss.type", havingValue = "aws")
public class AwsS3AutoConfiguration extends OssConnectionConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(AwsS3AutoConfiguration.class);

    AwsS3AutoConfiguration(OssProperties properties) {
        super(properties);
    }

    @Bean
    @ConditionalOnMissingBean(OssClientRequestFactory.class)
    OssClientRequestFactory ossClientRequestFactory() {
        LOGGER.info("AWS对象存储自动装配");
        Aws aws = getProperties().getAws();
        AWSCredentials credentials = new BasicAWSCredentials(aws.getAccessKeyId(), aws.getAccessKeySecret());
        EndpointConfiguration configuration =
            new AwsClientBuilder.EndpointConfiguration(aws.getEndpoint(), aws.getRegion());
        return new AwsS3OssClientRequestFactory(credentials, configuration);
    }
}
