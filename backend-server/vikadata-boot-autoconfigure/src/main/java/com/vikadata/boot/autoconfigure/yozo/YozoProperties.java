package com.vikadata.boot.autoconfigure.yozo;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 *
 * @author Shawn Deng
 * @date 2021-06-22 10:42:35
 */
@ConfigurationProperties(prefix = "vikadata-starter.yozo")
public class YozoProperties {

    private boolean enabled = false;

    /**
     * 应用唯一标识
     */
    private String appId;

    /**
     * 永中SAAS版的接口调用所需key
     */
    private String key;

    /**
     * 文件预览转换的API地址
     */
    private Uri uri;

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

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Uri getUri() {
        return uri;
    }

    public void setUri(Uri uri) {
        this.uri = uri;
    }

    public static class Uri {

        private String preview = "http://api.yozocloud.cn/getPreview";

        public String getPreview() {
            return preview;
        }

        public void setPreview(String preview) {
            this.preview = preview;
        }
    }
}
