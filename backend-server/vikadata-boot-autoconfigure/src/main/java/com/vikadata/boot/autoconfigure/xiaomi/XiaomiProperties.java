package com.vikadata.boot.autoconfigure.xiaomi;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 *
 * @author Shawn Deng
 * @date 2021-06-30 15:05:24
 */
@ConfigurationProperties(prefix = "vikadata-starter.xiaomi")
public class XiaomiProperties {

    private boolean enabled = false;

    private String publicKey;

    private List<String> ignoreUrls;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public List<String> getIgnoreUrls() {
        return ignoreUrls;
    }

    public void setIgnoreUrls(List<String> ignoreUrls) {
        this.ignoreUrls = ignoreUrls;
    }
}
