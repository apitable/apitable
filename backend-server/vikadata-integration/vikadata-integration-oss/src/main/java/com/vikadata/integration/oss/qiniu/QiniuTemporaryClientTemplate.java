package com.vikadata.integration.oss.qiniu;

import com.vikadata.integration.oss.OssClientRequest;
import com.vikadata.integration.oss.OssUploadAuth;
import com.vikadata.integration.oss.OssUploadPolicy;

/**
 *
 * @author Chambers
 * @date 2022/8/22
 */
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
