package com.vikadata.social.feishu.config;

import com.vikadata.social.core.SocialRedisOperations;

/**
 * 应用配置存储帮助类
 * @author Shawn Deng
 * @date 2022-01-19 17:12:49
 */
public class FeishuConfigStorageHelper {

    public static ConfigInRedisStorage withInitial(SocialRedisOperations redisOps,
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
