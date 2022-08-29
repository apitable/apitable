package com.vikadata.boot.autoconfigure.wx.miniapp;

import com.vikadata.boot.autoconfigure.wx.RedisConnectProperties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 *
 * @author Shawn Deng
 * @date 2021-06-21 16:41:29
 */
@ConfigurationProperties(prefix = "vikadata-starter.wx.miniapp")
public class WxMaProperties {

    /**
     * 是否启用（默认: false）
     */
    private boolean enabled = false;

    /**
     * 设置微信小程序的appid.
     */
    private String appId;

    /**
     * 设置微信小程序的Secret.
     */
    private String secret;

    /**
     * 设置微信小程序消息服务器配置的token.
     */
    private String token;

    /**
     * 设置微信小程序消息服务器配置的EncodingAESKey.
     */
    private String aesKey;

    /**
     * 消息格式，XML或者JSON.
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

        /**
         * 存储类型.
         */
        private StorageType storageType = StorageType.Memory;

        /**
         * 指定key前缀.
         */
        private String keyPrefix = "vikadata:wechat:miniapp";

        /**
         * http客户端类型.
         */
        private HttpClientType httpClientType = HttpClientType.HttpClient;

        /**
         * Redis配置，只有jedis才需要配置
         */
        private RedisConnectProperties redis;

        /**
         * http代理主机.
         */
        private String httpProxyHost;

        /**
         * http代理端口.
         */
        private Integer httpProxyPort;

        /**
         * http代理用户名.
         */
        private String httpProxyUsername;

        /**
         * http代理密码.
         */
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
        /**
         * 内存.
         */
        Memory,

        /**
         * redis(JedisClient).
         */
        Jedis,

        /**
         * redis(RedisTemplate).
         */
        RedisTemplate
    }

    public enum HttpClientType {
        /**
         * HttpClient.
         */
        HttpClient,

        /**
         * OkHttp.
         */
        OkHttp,

        /**
         * JoddHttp.
         */
        JoddHttp,
    }
}
