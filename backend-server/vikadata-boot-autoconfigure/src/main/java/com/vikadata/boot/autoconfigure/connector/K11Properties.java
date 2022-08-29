package com.vikadata.boot.autoconfigure.connector;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * 新世界 K11 属性
 * </p>
 *
 * @author Chambers
 * @date 2021/6/17
 */
@ConfigurationProperties(prefix = "vikadata-connector.k11")
public class K11Properties {

    private boolean enabled = false;

    private String domain;

    private String appId;

    private String appSecret;

    private String smsTempCode;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

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

    public String getSmsTempCode() {
        return smsTempCode;
    }

    public void setSmsTempCode(String smsTempCode) {
        this.smsTempCode = smsTempCode;
    }
}
