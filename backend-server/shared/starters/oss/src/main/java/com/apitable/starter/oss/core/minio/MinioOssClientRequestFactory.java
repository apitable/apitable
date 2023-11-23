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

package com.apitable.starter.oss.core.minio;

import com.apitable.starter.oss.core.OssClientRequest;
import com.apitable.starter.oss.core.OssClientRequestFactory;
import io.minio.MinioClient;

/**
 * minio oss client request factory.
 */
public class MinioOssClientRequestFactory implements OssClientRequestFactory {

    private final String endpoint;

    private final String accessKey;

    private final String secretKey;

    private final String bucketPolicyJson;

    /**
     * constructor.
     *
     * @param endpoint         minio endpoint
     * @param accessKey        access key
     * @param secretKey        secret key
     * @param bucketPolicyJson bucket policy json
     */
    public MinioOssClientRequestFactory(String endpoint, String accessKey, String secretKey,
                                        String bucketPolicyJson) {
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
