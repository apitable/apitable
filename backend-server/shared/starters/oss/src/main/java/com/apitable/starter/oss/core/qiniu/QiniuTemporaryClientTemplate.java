package com.apitable.starter.oss.core.qiniu;

import com.apitable.starter.oss.core.OssClientRequest;
import com.apitable.starter.oss.core.OssUploadAuth;
import com.apitable.starter.oss.core.OssUploadPolicy;

public class QiniuTemporaryClientTemplate {

    private QiniuOssClientRequestFactory ossClientRequestFactory;

    public QiniuTemporaryClientTemplate() {
    }

    public QiniuTemporaryClientTemplate(QiniuOssClientRequestFactory ossClientRequestFactory) {
        this.ossClientRequestFactory = ossClientRequestFactory;
    }

    public QiniuOssClientRequestFactory getOssClientRequestFactory() {
        return ossClientRequestFactory;
    }

    public OssUploadAuth uploadToken(String bucket, String key, long expires, OssUploadPolicy uploadPolicy) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.uploadToken(bucket, key, expires, uploadPolicy);
    }

    public boolean isValidCallback(String originAuthorization, String url, byte[] body, String contentType) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.isValidCallback(originAuthorization, url, body, contentType);
    }

}
