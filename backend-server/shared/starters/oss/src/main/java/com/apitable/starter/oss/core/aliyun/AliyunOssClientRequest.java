package com.apitable.starter.oss.core.aliyun;

import cn.hutool.core.util.StrUtil;
import com.aliyun.oss.OSS;
import com.aliyun.oss.model.OSSObject;
import com.aliyun.oss.model.ObjectMetadata;
import com.aliyun.oss.model.PutObjectResult;
import com.apitable.starter.oss.core.AbstractOssClientRequest;
import com.apitable.starter.oss.core.OssObject;
import com.apitable.starter.oss.core.UrlFetchResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Aliyun Cloud OSS storage request
 *
 * @author johnsoyzhao zzzzhaoziye@gmail.com
 * @Date 2023/1/31
 */
public class AliyunOssClientRequest  extends AbstractOssClientRequest {


    private static final String CONTENT_MD5 = "Content-MD5";

    private static final String CONTENT_TYPE = "Content-Type";

    private static final Logger LOGGER = LoggerFactory.getLogger(AliyunOssClientRequest.class);
    private OSS ossClient;

    private boolean autoCreateBucket;
    public AliyunOssClientRequest() {
    }

    public AliyunOssClientRequest(OSS  ossClient) {
        this.ossClient = ossClient;
    }

    public AliyunOssClientRequest(OSS ossClient, boolean autoCreateBucket) {
        this.ossClient = ossClient;
        this.autoCreateBucket = autoCreateBucket;
    }

    @Override
    protected boolean isBucketExist(String bucketName) {
        boolean exists = false;
        try {
            exists = ossClient.doesBucketExist(bucketName);
            if (!exists) {
                if (autoCreateBucket) {
                    ossClient.createBucket(bucketName);
                }
                else {
                    throw new UnsupportedOperationException("Your bucket does not exist and cannot be initialized");
                }
            }
        } catch (Exception e) {
            LOGGER.error("failed to upload network resources", e);
        }
        return exists;

    }

    @Override
    public UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath) throws IOException {
        isBucketExist(bucketName);
        try {
            PutObjectResult response = ossClient.putObject(bucketName,
                keyPath,
                getStream(remoteSrcUrl));
            byte[] buffer = new byte[1024];
            response.getResponse().getContent().read(buffer);
            response.getResponse().getContent().close();
            long contentLength = response.getResponse().getContentLength();
            String contentType = response.getResponse().getHeaders().get(CONTENT_TYPE);
            return new UrlFetchResponse(keyPath, response.getETag(), contentLength, contentType);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new IOException("upload failed", e);
        }
    }

    @Override
    public void uploadStreamForObject(String bucketName, InputStream in, String keyPath) throws IOException {
        isBucketExist(bucketName);
        try {
            ossClient.putObject(bucketName, keyPath, in);
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new IOException("upload failed", e);
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
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setUserMetadata(userMetadata);
            ossClient.putObject(bucketName, path, in, metadata);
        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException("upload failed", e);
        }
    }

    @Override
    public OssObject getObject(String bucketName, String path) {
        isBucketExist(bucketName);
        try (OSSObject ossObject = ossClient.getObject(bucketName, path)) {
            return new OssObject(ossObject.getResponse().getHeaders().get(CONTENT_MD5), ossObject.getResponse().getContentLength(),
                ossObject.getResponse().getHeaders().get(CONTENT_TYPE),  new BufferedInputStream(ossObject.getObjectContent()));
        } catch (Exception e) {
            LOGGER.error("aliyun get object error", e);
            return null;
        }
    }

    @Override
    public boolean deleteObject(String bucketName, String key) {
        isBucketExist(bucketName);
        try {
            ossClient.deleteObject(bucketName, key);
            return true;
        } catch (Exception e) {
            LOGGER.error("aliyun delete Object error", e);
            return false;
        }
    }

    @Override
    public void refreshCdn(String bucketName, String[] url) {
        throw new Error("aliyun is not implemented");
    }
}
