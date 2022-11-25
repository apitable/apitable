package com.vikadata.social.feishu;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import cn.hutool.core.util.StrUtil;

import com.vikadata.social.feishu.util.FeishuDecryptor;

/**
 * Feishu isv default configuration
 */
@Deprecated
public class FeishuIsvDefaultConfig {

    /**
     * Application id.
     */
    private String appId;

    /**
     * Application secret.
     */
    private String appSecret;

    /**
     * Data encryption key, optional
     */
    private String encryptKey;

    /**
     * Event validation token, required
     */
    private String verificationToken;

    /**
     * is isv
     */
    private Boolean isv;

    private final FeishuDecryptor decryptor;

    public FeishuIsvDefaultConfig(String appId, String appSecret, String encryptKey, String verificationToken, Boolean isv) {
        this.appId = appId;
        this.appSecret = appSecret;
        this.encryptKey = encryptKey;
        this.verificationToken = verificationToken;
        this.isv = isv;

        this.decryptor = StrUtil.isBlank(encryptKey) ? null : new FeishuDecryptor(encryptKey);
    }

    public boolean checkVerificationToken(String token) {
        if (token == null) {
            return verificationToken == null;
        }
        return token.equals(verificationToken);
    }

    public boolean needDecrypt() {
        return this.decryptor != null;
    }

    public String decrypt(String encryptedData) throws BadPaddingException, InvalidKeyException, NoSuchAlgorithmException, IllegalBlockSizeException, NoSuchPaddingException, InvalidAlgorithmParameterException {
        if (needDecrypt()) {
            return decryptor.decrypt(encryptedData);
        }
        else {
            return encryptedData;
        }
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getAppSecret() {
        return appSecret;
    }

    public void setAppSecret(String appSecret) {
        this.appSecret = appSecret;
    }

    public String getEncryptKey() {
        return encryptKey;
    }

    public void setEncryptKey(String encryptKey) {
        this.encryptKey = encryptKey;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    public Boolean isv() {
        return isv;
    }

    public void setIsv(Boolean isv) {
        this.isv = isv;
    }
}
