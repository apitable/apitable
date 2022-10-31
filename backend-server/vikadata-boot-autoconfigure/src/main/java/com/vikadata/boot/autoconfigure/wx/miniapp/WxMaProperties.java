package com.vikadata.boot.autoconfigure.wx.miniapp;

import com.vikadata.boot.autoconfigure.wx.RedisConnectProperties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "vikadata-starter.wx.miniapp")
public class WxMaProperties {

    /**
     * whether to enable（default: false）
     */
    private boolean enabled = false;

    /**
     * app id
     */
    private String appId;

    /**
     * app secret.
     */
    private String secret;

    /**
     * encrypt token
     */
    private String token;

    /**
     * aes key
     */
    private String aesKey;

    /**
     * message format, xml or json
     */
    private String msgDataFormat;

    private ConfigStorage configStorage;

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

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getAesKey() {
        return aesKey;
    }

    public void setAesKey(String aesKey) {
        this.aesKey = aesKey;
    }

    public String getMsgDataFormat() {
        return msgDataFormat;
    }

    public void setMsgDataFormat(String msgDataFormat) {
        this.msgDataFormat = msgDataFormat;
    }

    public ConfigStorage getConfigStorage() {
        return configStorage;
    }

    public void setConfigStorage(ConfigStorage configStorage) {
        this.configStorage = configStorage;
    }

    public static class ConfigStorage {

        private StorageType storageType = StorageType.Memory;

        /**
         * cache key prefix
         */
        private String keyPrefix = "vikadata:wechat:miniapp";

        /**
         * http client type
         */
        private HttpClientType httpClientType = HttpClientType.HttpClient;

        private RedisConnectProperties redis;

        private String httpProxyHost;

        private Integer httpProxyPort;

        private String httpProxyUsername;

        private String httpProxyPassword;

        public StorageType getStorageType() {
            return storageType;
        }

        public void setStorageType(StorageType storageType) {
            this.storageType = storageType;
        }

        public String getKeyPrefix() {
            return keyPrefix;
        }

        public void setKeyPrefix(String keyPrefix) {
            this.keyPrefix = keyPrefix;
        }

        public HttpClientType getHttpClientType() {
            return httpClientType;
        }

        public void setHttpClientType(HttpClientType httpClientType) {
            this.httpClientType = httpClientType;
        }

        public RedisConnectProperties getRedis() {
            return redis;
        }

        public void setRedis(RedisConnectProperties redis) {
            this.redis = redis;
        }

        public String getHttpProxyHost() {
            return httpProxyHost;
        }

        public void setHttpProxyHost(String httpProxyHost) {
            this.httpProxyHost = httpProxyHost;
        }

        public Integer getHttpProxyPort() {
            return httpProxyPort;
        }

        public void setHttpProxyPort(Integer httpProxyPort) {
            this.httpProxyPort = httpProxyPort;
        }

        public String getHttpProxyUsername() {
            return httpProxyUsername;
        }

        public void setHttpProxyUsername(String httpProxyUsername) {
            this.httpProxyUsername = httpProxyUsername;
        }

        public String getHttpProxyPassword() {
            return httpProxyPassword;
        }

        public void setHttpProxyPassword(String httpProxyPassword) {
            this.httpProxyPassword = httpProxyPassword;
        }
    }

    public enum StorageType {
        Memory, Jedis, RedisTemplate
    }

    public enum HttpClientType {
        HttpClient, OkHttp, JoddHttp,
    }
}
