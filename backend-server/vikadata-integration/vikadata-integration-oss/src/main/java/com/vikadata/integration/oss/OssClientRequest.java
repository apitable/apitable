package com.vikadata.integration.oss;

import java.io.IOException;
import java.io.InputStream;

/**
 *
 * @author Shawn Deng
 * @date 2021-03-23 12:50:55
 */
public interface OssClientRequest {

    UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath) throws IOException;

    void uploadStreamForObject(String bucketName, InputStream in, String keyPath) throws IOException;

    void uploadStreamForObject(String bucketName, InputStream in, String path, String mimeType, String digest) throws IOException;

    OssObject getObject(String bucketName, String path);

    boolean deleteObject(String bucketName, String key);

    void refreshCdn(String bucketName, String[] url);

    OssUploadAuth uoloadToken(String bucket, String key, long expires, OssUploadPolicy uploadPolicy);

    boolean isValidCallback(String originAuthorization, String url, byte[] body, String contentType);

}
