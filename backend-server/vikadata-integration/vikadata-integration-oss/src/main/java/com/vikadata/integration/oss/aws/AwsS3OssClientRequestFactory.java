package com.vikadata.integration.oss.aws;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import com.vikadata.integration.oss.OssClientRequest;
import com.vikadata.integration.oss.OssClientRequestFactory;

/**
 * aws s3 Client Request Construction Factory
 */
public class AwsS3OssClientRequestFactory implements OssClientRequestFactory {

    private AWSCredentials credentials;

    private EndpointConfiguration configuration;

    public AwsS3OssClientRequestFactory(AWSCredentials credentials, EndpointConfiguration configuration) {
        this.credentials = credentials;
        this.configuration = configuration;
    }

    @Override
    public OssClientRequest createClient() {
        AmazonS3 s3Client =
                AmazonS3ClientBuilder.standard()
                        .withCredentials(new AWSStaticCredentialsProvider(credentials))
                        .withEndpointConfiguration(configuration)
                        .enablePathStyleAccess()
                        .build();
        return new AwsOssClientRequest(s3Client, true);
    }
}
