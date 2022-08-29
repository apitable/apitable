package com.vikadata.integration.oss.minio;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import cn.hutool.core.util.StrUtil;
import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.ObjectWriteResponse;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.SetBucketPolicyArgs;
import okhttp3.Headers;

import com.vikadata.integration.oss.AbstractOssClientRequest;
import com.vikadata.integration.oss.OssObject;
import com.vikadata.integration.oss.OssUploadAuth;
import com.vikadata.integration.oss.OssUploadPolicy;
import com.vikadata.integration.oss.UrlFetchResponse;

import org.springframework.lang.NonNull;

/**
 * minio client 实现
 * @author Shawn Deng
 * @date 2021-03-23 15:15:58
 */
public class MinioOssClientRequest extends AbstractOssClientRequest {

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

    public MinioOssClientRequest(MinioClient minioClient, boolean autoCreateBucket, String bucketPolicyJson) {
        this.minioClient = minioClient;
        this.autoCreateBucket = autoCreateBucket;
        this.bucketPolicyJson = bucketPolicyJson;
    }

    @Override
    protected boolean isBucketExist(String bucketName) {
        boolean found = false;
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
                }
                else {
                    throw new UnsupportedOperationException("您的Bucket不存在，无法初始化");
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return found;
    }

    @Override
    public UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath) throws IOException {
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
            long contentLength = StrUtil.isNotBlank(lengthString) ? Long.parseLong(lengthString) : 0L;
            return new UrlFetchResponse(response.object(), response.etag(), contentLength, contentType);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new IOException("上传失败", e);
        }
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String keyPath) throws IOException {
        isBucketExist(bucketName);
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(keyPath)
                            .stream(in, -1, 10485760)
                            .build());
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new IOException("上传失败", e);
        }
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String path, String mimeType, String digest) throws IOException {
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
                            // 10M分片上传
                            .stream(in, -1, 10485760)
                            .contentType(mimeType)
                            .headers(userMetadata)
                            .build());
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new IOException("上传失败", e);
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
                    Objects.isNull(headers.get(CONTENT_LENGTH)) ? 0 : Long.parseLong(Objects.requireNonNull(headers.get(CONTENT_LENGTH))),
                    headers.get(CONTENT_TYPE), response);
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
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
        }
        catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public void refreshCdn(String bucketName, String[] url) {
        throw new Error("minio未实现该方法");
    }

    @Override
    public OssUploadAuth uoloadToken(String bucket, String key, long expires, @NonNull OssUploadPolicy uploadPolicy) {
        // TODO minio 马上支持
        OssUploadAuth ossUploadAuth = new OssUploadAuth();
        return ossUploadAuth;
    }

    @Override
    public boolean isValidCallback(String originAuthorization, String url, byte[] body, String contentType) {
        // TODO minio 马上支持
        return false;
    }
}
