package com.apitable.starter.oss.autoconfigure;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.s3.AmazonS3;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.apitable.starter.oss.autoconfigure.OssProperties.Aws;
import com.apitable.starter.oss.core.OssClientRequestFactory;
import com.apitable.starter.oss.core.aws.AwsS3OssClientRequestFactory;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Amazon Cloud S3 storage autoconfiguration
 *
 * @author Shawn Deng
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
        Aws aws = getProperties().getAws();
        AWSCredentials credentials = new BasicAWSCredentials(aws.getAccessKeyId(), aws.getAccessKeySecret());
        EndpointConfiguration configuration =
                new AwsClientBuilder.EndpointConfiguration(aws.getEndpoint(), aws.getRegion());
        return new AwsS3OssClientRequestFactory(credentials, configuration);
    }
}
