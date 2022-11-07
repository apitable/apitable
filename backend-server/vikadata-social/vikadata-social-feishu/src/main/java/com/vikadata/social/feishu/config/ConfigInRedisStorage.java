package com.vikadata.social.feishu.config;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import cn.hutool.core.util.StrUtil;

import com.vikadata.social.feishu.util.FeishuDecryptor;

/**
 * Based on redis storage configuration
 */
public class ConfigInRedisStorage implements FeishuConfigStorage {

    private static final String APP_ACCESS_TOKEN_KEY_TPL = "%s:feishu:app_access_token:%s";

    private static final String USER_ACCESS_TOKEN_KEY_TPL = "%s:feishu:user_access_token:%s:%s";

    private static final String TENANT_ACCESS_TOKEN_KEY_TPL = "%s:feishu:tenant_access_token:%s:%s";

    private static final String LOCK_KEY_TPL = "%s:feishu:lock:%s:";

    private static final String DYNAMIC_KEY_TPL = "%s:feishu:lock:%s:%s:";

    private final FeishuRedisOperations redisOps;

    private final String redisKeyPrefix;

    protected volatile String appId;

    protected volatile String appSecret;

    protected volatile boolean isv;

    /**
     * data encryption key
     */
    protected volatile String encryptKey;

    /**
     * event verification token
     */
    protected volatile String verificationToken;

    protected FeishuDecryptor decryptor;

    protected volatile Lock appAccessTokenLock;

    protected Map<String, Lock> userTokenLockMap = new ConcurrentHashMap<>();

    protected Map<String, Lock> tenantTokenLockMap = new ConcurrentHashMap<>();

    private String appAccessTokenKey;

    public ConfigInRedisStorage(FeishuRedisOperations redisOps) {
        this(redisOps, "vikadata");
    }

    public ConfigInRedisStorage(FeishuRedisOperations redisOps, String redisKeyPrefix) {
        this.redisOps = redisOps;
        this.redisKeyPrefix = redisKeyPrefix;
    }

    @Override
    public String getAppId() {
        return this.appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
        this.appAccessTokenKey = String.format(APP_ACCESS_TOKEN_KEY_TPL, this.redisKeyPrefix, appId);
        String lockKey = String.format(LOCK_KEY_TPL, this.redisKeyPrefix, appId);
        this.appAccessTokenLock = this.redisOps.getLock(lockKey.concat("appAccessTokenLock"));
    }

    @Override
    public String getAppSecret() {
        return this.appSecret;
    }

    public void setAppSecret(String appSecret) {
        this.appSecret = appSecret;
    }

    public void setIsv(boolean isv) {
        this.isv = isv;
    }

    @Override
    public boolean isv() {
        return this.isv;
    }

    @Override
    public String getEncryptKey() {
        return encryptKey;
    }

    @Override
    public void setEncryptKey(String encryptKey) {
        this.encryptKey = encryptKey;
        decryptor = StrUtil.isBlank(encryptKey) ? null : new FeishuDecryptor(encryptKey);
    }

    @Override
    public String getVerificationToken() {
        return verificationToken;
    }

    @Override
    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    // Base Action Method

    @Override
    public boolean needDecrypt() {
        return this.decryptor != null;
    }

    @Override
    public String decrypt(String encryptedData) throws BadPaddingException, InvalidKeyException, NoSuchAlgorithmException, IllegalBlockSizeException, NoSuchPaddingException, InvalidAlgorithmParameterException {
        if (needDecrypt()) {
            return decryptor.decrypt(encryptedData);
        }
        else {
            return encryptedData;
        }
    }

    @Override
    public boolean checkVerificationToken(String token) {
        if (token == null) {
            return verificationToken == null;
        }
        return token.equals(verificationToken);
    }

    // USER ACCESS TOKEN

    @Override
    public Lock getUserAccessTokenLock(String userAuth) {
        if (!userTokenLockMap.containsKey(userAuth)) {
            String lockKey = String.format(DYNAMIC_KEY_TPL, this.redisKeyPrefix, appId, userAuth);
            Lock userAccessTokenLock = this.redisOps.getLock(lockKey.concat("userAccessTokenLock"));
            this.userTokenLockMap.put(userAuth, userAccessTokenLock);
        }
        return this.userTokenLockMap.get(userAuth);
    }

    @Override
    public String getUserAccessToken(String accessToken) {
        return redisOps.getValue(String.format(USER_ACCESS_TOKEN_KEY_TPL, this.redisKeyPrefix, appId, accessToken));
    }

    @Override
    public synchronized void updateUserAccessToken(String accessToken, String refreshToken, int expiresInSeconds) {
        this.redisOps.setValue(String.format(USER_ACCESS_TOKEN_KEY_TPL, this.redisKeyPrefix, appId, accessToken), refreshToken, expiresInSeconds - 200, TimeUnit.SECONDS);
    }

    @Override
    public boolean isUserAccessTokenExpired(String accessToken) {
        Long expire = redisOps.getExpire(String.format(USER_ACCESS_TOKEN_KEY_TPL, this.redisKeyPrefix, appId, accessToken));
        return expire == null || expire < 2;
    }

    @Override
    public void expireUserAccessToken(String accessToken) {
        redisOps.expire(String.format(USER_ACCESS_TOKEN_KEY_TPL, this.redisKeyPrefix, appId, accessToken), 0, TimeUnit.SECONDS);
    }

    // APP ACCESS TOKEN

    @Override
    public Lock getAppAccessTokenLock() {
        return this.appAccessTokenLock;
    }

    @Override
    public String getAppAccessToken() {
        return redisOps.getValue(this.appAccessTokenKey);
    }

    @Override
    public synchronized void updateAppAccessToken(String appAccessToken, int expiresInSeconds) {
        redisOps.setValue(this.appAccessTokenKey, appAccessToken, expiresInSeconds - 200, TimeUnit.SECONDS);
    }

    @Override
    public boolean isAppAccessTokenExpired() {
        Long expire = redisOps.getExpire(this.appAccessTokenKey);
        return expire == null || expire < 2;
    }

    @Override
    public void expireAppAccessToken() {
        redisOps.expire(this.appAccessTokenKey, 0, TimeUnit.SECONDS);
    }

    // TENANT ACCESS TOKEN

    @Override
    public Lock getTenantAccessTokenLock(String tenantKey) {
        if (!tenantTokenLockMap.containsKey(tenantKey)) {
            String lockKey = String.format(DYNAMIC_KEY_TPL, this.redisKeyPrefix, appId, tenantKey);
            Lock userAccessTokenLock = this.redisOps.getLock(lockKey.concat("tenantAccessTokenLock"));
            this.tenantTokenLockMap.put(tenantKey, userAccessTokenLock);
        }
        return this.tenantTokenLockMap.get(tenantKey);
    }

    @Override
    public String getTenantAccessToken(String tenantKey) {
        return redisOps.getValue(String.format(TENANT_ACCESS_TOKEN_KEY_TPL, this.redisKeyPrefix, appId, tenantKey));
    }

    @Override
    public synchronized void updateTenantAccessToken(String tenantKey, String tenantAccessToken, int expiresInSeconds) {
        redisOps.setValue(String.format(TENANT_ACCESS_TOKEN_KEY_TPL, this.redisKeyPrefix, appId, tenantKey), tenantAccessToken, expiresInSeconds - 200, TimeUnit.SECONDS);
    }

    @Override
    public boolean isTenantAccessTokenExpired(String tenantKey) {
        Long expire = redisOps.getExpire(String.format(TENANT_ACCESS_TOKEN_KEY_TPL, this.redisKeyPrefix, appId, tenantKey));
        return expire == null || expire < 2;
    }

    @Override
    public void expireTenantAccessToken(String tenantKey) {
        redisOps.expire(String.format(TENANT_ACCESS_TOKEN_KEY_TPL, this.redisKeyPrefix, appId, tenantKey), 0, TimeUnit.SECONDS);
    }
}
