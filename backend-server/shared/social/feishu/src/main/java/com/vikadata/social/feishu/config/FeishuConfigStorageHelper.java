package com.vikadata.social.feishu.config;

/**
 * Application configuration storage helper class
 */
public class FeishuConfigStorageHelper {

    public static ConfigInRedisStorage withInitial(FeishuRedisOperations redisOps,
            String appId, String appSecret, boolean isv, String encryptKey, String verificationToken) {
        ConfigInRedisStorage configStorage = new ConfigInRedisStorage(redisOps);
        configStorage.setAppId(appId);
        configStorage.setAppSecret(appSecret);
        configStorage.setIsv(isv);
        configStorage.setEncryptKey(encryptKey);
        configStorage.setVerificationToken(verificationToken);
        return configStorage;
    }
}
