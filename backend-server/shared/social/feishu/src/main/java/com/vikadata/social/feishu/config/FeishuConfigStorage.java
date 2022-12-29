package com.vikadata.social.feishu.config;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import com.vikadata.social.core.ConfigStorage;

/**
 * Feishu application configuration storage interface
 */
public interface FeishuConfigStorage extends ConfigStorage {

    String getEncryptKey();

    void setEncryptKey(String encryptKey);

    String getVerificationToken();

    void setVerificationToken(String verificationToken);

    boolean needDecrypt();

    String decrypt(String encryptedData) throws BadPaddingException, InvalidKeyException, NoSuchAlgorithmException, IllegalBlockSizeException, NoSuchPaddingException, InvalidAlgorithmParameterException;

    boolean checkVerificationToken(String token);
}
