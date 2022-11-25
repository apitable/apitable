package com.apitable.starter.teg.autoconfigure;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "vikadata-starter.teg")
public class TegProperties {

    private boolean enabled = false;

    private String tokenKey;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getTokenKey() {
        return tokenKey;
    }

    public void setTokenKey(String tokenKey) {
        this.tokenKey = tokenKey;
    }

    public List<String> getIgnoreUrls() {
        return ignoreUrls;
    }

    public void setIgnoreUrls(List<String> ignoreUrls) {
        this.ignoreUrls = ignoreUrls;
    }

    private List<String> ignoreUrls;

    /**
     * Tencent teg's jwt request header
     */
    public static class SmartProxyHeaderProperty {
        public static final String REQUEST_TIMESTAMP = "timestamp";
        public static final String REQUEST_SIGNATURE = "Signature";
        public static final String REQUEST_STAFFID = "Staffid";
        public static final String REQUEST_STAFFNAME = "Staffname";
        public static final String REQUEST_X_EXT_DATA = "x-ext-data";
        public static final String REQUEST_X_RIO_SEQ = "X-Rio-Seq";
        public static final String REQUEST_IGNORE_URL = "ignoreUrl";
    }
}
