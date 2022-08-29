package com.vikadata.social.qq;

/**
 * 应用配置
 * @author Shawn Deng
 * @date 2021-01-11 18:25:01
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
     * 回调地址
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
