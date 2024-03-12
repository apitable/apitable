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

import cn.hutool.core.util.StrUtil;
import com.apitable.starter.oss.core.AbstractOssClientRequest;
import com.apitable.starter.oss.core.OssObject;
import com.apitable.starter.oss.core.OssStatObject;
import com.apitable.starter.oss.core.OssUploadAuth;
import com.apitable.starter.oss.core.OssUploadPolicy;
import com.apitable.starter.oss.core.UrlFetchResponse;
import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.ObjectWriteResponse;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.SetBucketPolicyArgs;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import io.minio.http.Method;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import okhttp3.Headers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * minio client realization.
 */
public class MinioOssClientRequest extends AbstractOssClientRequest {

    private static final Logger LOGGER = LoggerFactory.getLogger(MinioOssClientRequest.class);

    private static final String CONTENT_MD5 = "Content-MD5";

    private static final String CONTENT_TYPE = "Content-Type";

    private static final String CONTENT_LENGTH = "Content-Length";

    private final MinioClient minioClient;

    private final boolean autoCreateBucket;

    private String bucketPolicyJson;

    public MinioOssClientRequest(MinioClient minioClient) {
        this(minioClient, false);
    }

    public MinioOssClientRequest(MinioClient minioClient, boolean autoCreateBucket) {
        this.minioClient = minioClient;
        this.autoCreateBucket = autoCreateBucket;
    }

    /**
     * constructor.
     *
     * @param minioClient      minio client
     * @param autoCreateBucket auto create bucket
     * @param bucketPolicyJson bucket policy json
     */
    public MinioOssClientRequest(MinioClient minioClient, boolean autoCreateBucket,
                                 String bucketPolicyJson) {
        this.minioClient = minioClient;
        this.autoCreateBucket = autoCreateBucket;
        this.bucketPolicyJson = bucketPolicyJson;
    }

    @Override
    protected void isBucketExist(String bucketName) {
        boolean found;
        try {
            found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                if (autoCreateBucket) {
                    minioClient.makeBucket(
                        MakeBucketArgs.builder()
                            .bucket(bucketName)
                            .build()
                    );
                    minioClient.setBucketPolicy(
                        SetBucketPolicyArgs.builder()
                            .bucket(bucketName)
                            .config(bucketPolicyJson)
                            .build()
                    );
                } else {
                    throw new UnsupportedOperationException(
                        "Your bucket does not exist and cannot be initialized");
                }
            }
        } catch (Exception e) {
            LOGGER.error("minio bucket not exist", e);
        }
    }

    @Override
    public UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath)
        throws IOException {
        isBucketExist(bucketName);
        try {
            ObjectWriteResponse response = minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(keyPath)
                    .stream(getStream(remoteSrcUrl), -1, 10485760)
                    .build());
            String contentType = response.headers().get("Content-Type");
            String lengthString = response.headers().get("Content-Length");
            long contentLength =
                lengthString != null && !lengthString.isEmpty() ? Long.parseLong(lengthString) : 0L;
            return new UrlFetchResponse(response.object(), response.etag(), contentLength,
                contentType);
        } catch (Exception e) {
            throw new IOException("upload failed", e);
        }
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String keyPath)
        throws IOException {
        isBucketExist(bucketName);
        try {
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(keyPath)
                    .stream(in, -1, 10485760)
                    .build());
        } catch (Exception e) {
            throw new IOException("upload failed", e);
        }
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String path,
                                      String mimeType, String digest) throws IOException {
        isBucketExist(bucketName);
        try {
            Map<String, String> userMetadata = new HashMap<>(16);
            if (StrUtil.isNotBlank(mimeType)) {
                userMetadata.put(CONTENT_TYPE, mimeType);
            }
            if (StrUtil.isNotBlank(digest)) {
                userMetadata.put(CONTENT_MD5, digest);
            }
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(path)
                    // 10M slice upload
                    .stream(in, -1, 10485760)
                    .contentType(mimeType)
                    .headers(userMetadata)
                    .build());
        } catch (Exception e) {
            throw new IOException("upload failed", e);
        }
    }

    @Override
    public OssObject getObject(String bucketName, String path) {
        isBucketExist(bucketName);
        try (GetObjectResponse response =
                 minioClient.getObject(
                     GetObjectArgs.builder()
                         .bucket(bucketName)
                         .object(path)
                         .build()
                 )) {
            Headers headers = response.headers();
            return new OssObject(headers.get(CONTENT_MD5),
                Objects.isNull(headers.get(CONTENT_LENGTH)) ? 0 :
                    Long.parseLong(Objects.requireNonNull(headers.get(CONTENT_LENGTH))),
                headers.get(CONTENT_TYPE), response);
        } catch (Exception e) {
            LOGGER.error("minio get object failed", e);
            return null;
        }
    }

    @Override
    public OssStatObject getStatObject(String bucketName, String key) {
        try {
            StatObjectResponse stat = minioClient.statObject(
                StatObjectArgs.builder()
                    .bucket(bucketName)
                    .object(key)
                    .build());
            return new OssStatObject(stat.object(), stat.etag(), stat.size(),
                stat.headers().get(CONTENT_TYPE));
        } catch (Exception e) {
            LOGGER.error("minio get stat object failed", e);
        }
        return null;
    }

    @Override
    public void executeStreamFunction(String bucketName, String key,
                                      Consumer<InputStream> function) {
        try (GetObjectResponse response =
                 minioClient.getObject(
                     GetObjectArgs.builder()
                         .bucket(bucketName)
                         .object(key)
                         .build()
                 )) {
            function.accept(response);
        } catch (Exception e) {
            LOGGER.error("execute stream function failed", e);
        }
    }

    @Override
    public boolean deleteObject(String bucketName, String key) {
        isBucketExist(bucketName);
        try {
            minioClient.removeObject(
                RemoveObjectArgs.builder()
                    .bucket(bucketName)
                    .object(key)
                    .build());
            return true;
        } catch (Exception e) {
            LOGGER.error("minio delete object failed", e);
            return false;
        }
    }

    @Override
    public void refreshCdn(String bucketName, String[] url) {
        throw new Error("minio is not implemented");
    }

    @Override
    public OssUploadAuth uploadToken(String bucket, String key, long expires,
                                     OssUploadPolicy uploadPolicy) {
        isBucketExist(bucket);
        OssUploadAuth ossUploadAuth = new OssUploadAuth();
        Map<String, String> reqParams = new HashMap<>();
        try {
            String url = minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                    .method(Method.PUT)
                    .bucket(bucket)
                    .object(key)
                    .expiry((int) expires, TimeUnit.SECONDS)
                    .extraQueryParams(reqParams)
                    .build());
            ossUploadAuth.setUploadUrl(url);
            ossUploadAuth.setUploadRequestMethod("PUT");
        } catch (Exception e) {
            LOGGER.error("minio get upload token failed", e);
        }
        return ossUploadAuth;
    }

    @Override
    public boolean isValidCallback(String originAuthorization, String url, byte[] body,
                                   String contentType) {
        // TODO minio support immediately
        return false;
    }
}
