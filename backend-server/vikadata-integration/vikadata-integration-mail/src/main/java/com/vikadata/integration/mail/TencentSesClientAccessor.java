package com.vikadata.integration.mail;

import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.ses.v20201002.SesClient;

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
        // instantiate an authentication object
        Credential cred = new Credential(secretId, secretKey);

        // instantiate a http option
        HttpProfile httpProfile = new HttpProfile();
        httpProfile.setEndpoint(ENDPOINT);

        // Instantiate a client option
        ClientProfile clientProfile = new ClientProfile();
        clientProfile.setHttpProfile(httpProfile);

        // instantiate the client object of the requested product
        return new SesClient(cred, region, clientProfile);
    }
}
