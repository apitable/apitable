package com.apitable.starter.oss.core.qiniu;

import com.qiniu.util.Auth;

import com.apitable.starter.oss.core.OssClientRequest;
import com.apitable.starter.oss.core.OssClientRequestFactory;

public class QiniuOssClientRequestFactory implements OssClientRequestFactory {

    private final Auth auth;

    private final String regionId;

    private final String downloadDomain;

    private final String callbackUrl;

    private final String callbackBodyType;

    private final String uploadUrl;

    public QiniuOssClientRequestFactory(Auth auth, String regionId, String downloadDomain, String callbackUrl, String callbackBodyType, String uploadUrl) {
        this.auth = auth;
        this.regionId = regionId;
        this.downloadDomain = downloadDomain;
        this.callbackUrl = callbackUrl;
        this.callbackBodyType = callbackBodyType;
        this.uploadUrl = uploadUrl;
    }

    @Override
    public OssClientRequest createClient() {
        return new QiniuOssClientRequest(auth, regionId, downloadDomain, callbackUrl, callbackBodyType, uploadUrl, true);
    }
}
