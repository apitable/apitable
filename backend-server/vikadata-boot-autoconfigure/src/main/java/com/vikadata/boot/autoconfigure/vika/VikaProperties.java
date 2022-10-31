package com.vikadata.boot.autoconfigure.vika;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * <p>
 * vika sdk properties
 * </p>
 *
 * @author Chambers
 * @date 2021/3/26
 */
@ConfigurationProperties(prefix = "vikadata-starter.vika")
public class VikaProperties {

    private boolean enabled = false;

    private String host;

    private String token;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
