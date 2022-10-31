package com.vikadata.integration.oss.minio;

import io.minio.MinioClient;

import com.vikadata.integration.oss.OssClientRequest;
import com.vikadata.integration.oss.OssClientRequestFactory;

public class MinioOssClientRequestFactory implements OssClientRequestFactory {

    private final String endpoint;

    private final String accessKey;

    private final String secretKey;

    private final String bucketPolicyJson;

    public MinioOssClientRequestFactory(String endpoint, String accessKey, String secretKey, String bucketPolicyJson) {
        this.endpoint = endpoint;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.bucketPolicyJson = bucketPolicyJson;
    }

    @Override
    public OssClientRequest createClient() {
        MinioClient minioClient =
            MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
        return new MinioOssClientRequest(minioClient, true, bucketPolicyJson);
    }
}
