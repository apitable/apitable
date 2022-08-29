package com.vikadata.boot.autoconfigure.qq;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * QQ互联-网站应用 配置文件
 *
 * @author Chambers
 * @date 2020/10/16
 */
@ConfigurationProperties(prefix = "vikadata-starter.tencent.webapp")
public class WebAppProperties {

    /**
     * 是否开启
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
     * 回调地址
     */
    private String redirectUri;

    /**
     * 是否申请了unionId
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
