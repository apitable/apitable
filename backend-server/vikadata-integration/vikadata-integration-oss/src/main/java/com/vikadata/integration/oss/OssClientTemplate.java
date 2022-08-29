package com.vikadata.integration.oss;

import java.io.IOException;
import java.io.InputStream;

/**
 *
 * @author Shawn Deng
 * @date 2021-03-23 14:21:46
 */
public class OssClientTemplate {

    private OssClientRequestFactory ossClientRequestFactory;

    public OssClientTemplate() {
    }

    public OssClientRequestFactory getOssClientRequestFactory() {
        return ossClientRequestFactory;
    }

    public void setOssClientRequestFactory(OssClientRequestFactory ossClientRequestFactory) {
        this.ossClientRequestFactory = ossClientRequestFactory;
    }

    /**
     * 上传网络资源
     * @param bucketName 存储桶名称
     * @param remoteUrl 网络资源地址
     * @param keyPath 保存到存储桶的文件名，如果是空，则抓取网络资源的地址
     * @return UrlFetchResponse
     * @throws IOException io异常
     */
    public UrlFetchResponse upload(String bucketName, String remoteUrl, String keyPath) throws IOException {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.uploadRemoteUrl(bucketName, remoteUrl, keyPath);
    }

    public void upload(String bucketName, InputStream in, String keyPath) throws IOException {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        request.uploadStreamForObject(bucketName, in, keyPath);
    }

    public void upload(String bucketName, InputStream in, String path, String mimeType, String digest) throws IOException {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        request.uploadStreamForObject(bucketName, in, path, mimeType, digest);
    }

    public OssObject getObject(String bucketName, String key) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.getObject(bucketName, key);
    }

    public boolean delete(String bucketName, String key) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.deleteObject(bucketName, key);
    }

    public void refreshCdn(String bucketName, String[] url) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        request.refreshCdn(bucketName, url);
    }

    public OssUploadAuth uploadToken(String bucket, String key, long expires, OssUploadPolicy uploadPolicy) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.uoloadToken(bucket, key, expires, uploadPolicy);
    }

    public boolean isValidCallback(String originAuthorization, String url, byte[] body, String contentType) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.isValidCallback(originAuthorization, url, body, contentType);
    }

}
