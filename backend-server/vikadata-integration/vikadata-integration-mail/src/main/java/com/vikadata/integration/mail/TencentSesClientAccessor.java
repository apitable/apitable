package com.vikadata.integration.mail;

import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.ses.v20201002.SesClient;

/**
 * <p> 
 *
 * </p> 
 *
 * @author Chambers
 * @date 2022/2/9
 */
public abstract class TencentSesClientAccessor {

    private static final String ENDPOINT = "ses.tencentcloudapi.com";

    private final String region;

    private final String secretId;

    private final String secretKey;

    protected String from;

    protected String reply;

    public TencentSesClientAccessor(String region, String secretId, String secretKey, String from, String reply) {
        this.region = region;
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.from = from;
        this.reply = reply;
    }

    protected SesClient getClient() {
        // 实例化一个认证对象
        Credential cred = new Credential(secretId, secretKey);

        // 实例化一个http选项
        HttpProfile httpProfile = new HttpProfile();
        httpProfile.setEndpoint(ENDPOINT);

        // 实例化一个client选项
        ClientProfile clientProfile = new ClientProfile();
        clientProfile.setHttpProfile(httpProfile);

        // 实例化要请求产品的client对象
        return new SesClient(cred, region, clientProfile);
    }
}
