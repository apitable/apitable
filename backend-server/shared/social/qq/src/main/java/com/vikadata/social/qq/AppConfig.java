package com.vikadata.social.qq;

/**
 * Application configuration
 */
public class AppConfig {

    /**
     * appId
     */
    private String appId;

    /**
     * appKey
     */
    private String appKey;

    /**
     * callback uri
     */
    private String redirectUri;

    private Boolean applyUnion = true;

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getAppKey() {
        return appKey;
    }

    public void setAppKey(String appKey) {
        this.appKey = appKey;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }

    public Boolean getApplyUnion() {
        return applyUnion;
    }

    public void setApplyUnion(Boolean applyUnion) {
        this.applyUnion = applyUnion;
    }
}
