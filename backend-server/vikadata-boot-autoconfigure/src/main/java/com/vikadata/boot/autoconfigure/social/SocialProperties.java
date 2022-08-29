package com.vikadata.boot.autoconfigure.social;

/**
 * 社交媒体的通用配置
 *
 * @author Shawn Deng
 * @date 2020-11-18 18:16:58
 */
public class SocialProperties {

    /**
     * Application id.
     */
    private String appId;

    /**
     * Application secret.
     */
    private String appSecret;

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getAppSecret() {
        return appSecret;
    }

    public void setAppSecret(String appSecret) {
        this.appSecret = appSecret;
    }
}
