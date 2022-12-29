package com.vikadata.social.feishu.config;

import java.io.Serializable;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import lombok.Getter;

/**
 * Memory-based configuration storage Production environment should be best for persistence management
 */
public class ConfigInMemoryStorage implements FeishuConfigStorage, Serializable {

    @Getter
    protected volatile String appId;

    @Getter
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

    protected volatile String userAccessToken;

    protected volatile long userAccessTokenExpiresTime;

    protected volatile Lock userAccessTokenLock = new ReentrantLock();

    @Getter
    protected volatile String appAccessToken;

    protected volatile long appAccessTokenExpiresTime;

    @Getter
    protected volatile Lock appAccessTokenLock = new ReentrantLock();

    protected volatile String tenantAccessToken;

    protected volatile long tenantAccessTokenExpiresTime;

    @Getter
    protected volatile Lock tenantAccessTokenLock = new ReentrantLock();

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
    }

    @Override
    public String getVerificationToken() {
        return verificationToken;
    }

    @Override
    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    @Override
    public boolean needDecrypt() {
        return false;
    }

    @Override
    public String decrypt(String encryptedData) throws BadPaddingException, InvalidKeyException, NoSuchAlgorithmException, IllegalBlockSizeException, NoSuchPaddingException, InvalidAlgorithmParameterException {
        return null;
    }

    @Override
    public boolean checkVerificationToken(String token) {
        return false;
    }

    @Override
    public Lock getUserAccessTokenLock(String userAuth) {
        return this.userAccessTokenLock;
    }

    @Override
    public Lock getTenantAccessTokenLock(String tenantKey) {
        return null;
    }

    @Override
    public String getUserAccessToken(String userAuth) {
        return null;
    }

    @Override
    public void updateUserAccessToken(String userAuth, String userAccessToken, int expiresInSeconds) {
        this.userAccessToken = userAccessToken;
        this.userAccessTokenExpiresTime = System.currentTimeMillis() + (expiresInSeconds - 200) * 1000L;
    }

    @Override
    public boolean isUserAccessTokenExpired(String userAuth) {
        return System.currentTimeMillis() > this.userAccessTokenExpiresTime;
    }

    @Override
    public void expireUserAccessToken(String userAuth) {
        this.userAccessTokenExpiresTime = 0;
    }

    @Override
    public void updateAppAccessToken(String appAccessToken, int expiresInSeconds) {
        this.appAccessToken = appAccessToken;
        this.appAccessTokenExpiresTime = System.currentTimeMillis() + (expiresInSeconds - 200) * 1000L;
    }

    @Override
    public boolean isAppAccessTokenExpired() {
        return System.currentTimeMillis() > this.appAccessTokenExpiresTime;
    }

    @Override
    public void expireAppAccessToken() {
        this.appAccessTokenExpiresTime = 0;
    }

    @Override
    public String getTenantAccessToken(String tenantKey) {
        return null;
    }

    @Override
    public void updateTenantAccessToken(String tenantKey, String tenantAccessToken, int expiresInSeconds) {
        this.tenantAccessToken = tenantAccessToken;
        this.tenantAccessTokenExpiresTime = System.currentTimeMillis() + (expiresInSeconds - 200) * 1000L;
    }

    @Override
    public boolean isTenantAccessTokenExpired(String tenantKey) {
        return System.currentTimeMillis() > this.tenantAccessTokenExpiresTime;
    }

    @Override
    public void expireTenantAccessToken(String tenantKey) {
        this.tenantAccessTokenExpiresTime = 0;
    }
}
