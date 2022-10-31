package com.vikadata.boot.autoconfigure.qq;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "vikadata-starter.tencent.webapp")
public class WebAppProperties {

    /**
     * whether to enable, default false
     */
    private boolean enabled = false;

    /**
     * appId
     */
    private String appId;

    /**
     * appKey
     */
    private String appKey;

    /**
     * redirect uri
     */
    private String redirectUri;

    /**
     * Whether union ID is applied
     */
    private boolean applyUnion = true;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

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

    public boolean isApplyUnion() {
        return applyUnion;
    }

    public void setApplyUnion(boolean applyUnion) {
        this.applyUnion = applyUnion;
    }
}
