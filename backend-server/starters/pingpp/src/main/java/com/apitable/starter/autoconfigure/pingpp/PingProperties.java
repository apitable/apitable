package com.apitable.starter.autoconfigure.pingpp;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 *  ping plus plus properties
 * </p>
 * @author Shawn Deng
 */
@ConfigurationProperties(prefix = "vikadata-starter.pingpp")
public class PingProperties {

    private boolean enabled = false;

    private String apiKey;

    private String privateKeyPath;

    private String appId;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getPrivateKeyPath() {
        return privateKeyPath;
    }

    public void setPrivateKeyPath(String privateKeyPath) {
        this.privateKeyPath = privateKeyPath;
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }
}
