/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.starter.oss.autoconfigure;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.s3.AmazonS3;
import com.apitable.starter.oss.autoconfigure.OssProperties.Aws;
import com.apitable.starter.oss.core.OssClientRequestFactory;
import com.apitable.starter.oss.core.aws.AwsS3OssClientRequestFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Amazon Cloud S3 storage autoconfiguration.
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(AmazonS3.class)
@ConditionalOnProperty(value = "starter.oss.type", havingValue = "aws")
public class AwsS3AutoConfiguration extends OssConnectionConfiguration {

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
