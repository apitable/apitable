package com.vikadata.api.enterprise.social.util;

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;

/**
 * Aes encryption and decryption
 */
public class AESCipher {
    public AESCipher() {
    }

    public  static String encrypt(String content, String password) {
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            byte[] byteContent = content.getBytes(StandardCharsets.UTF_8);
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(password));
            byte[] result = cipher.doFinal(byteContent);
            return new String(Base64.encodeBase64(result), StandardCharsets.UTF_8);
        } catch (Exception var6) {
            Logger.getLogger(AESCipher.class.getName()).log(Level.SEVERE, null, var6);
            return null;
        }
    }

    public static String decrypt(String content, String password) {
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, getSecretKey(password));
            byte[] result = cipher.doFinal(Base64.decodeBase64(content.getBytes()));
            return new String(result, StandardCharsets.UTF_8);
        } catch (Exception var5) {
            Logger.getLogger(AESCipher.class.getName()).log(Level.SEVERE,null, var5);
            return null;
        }
    }

    private static SecretKeySpec getSecretKey(String password) {
        KeyGenerator kg;
        try {
            kg = KeyGenerator.getInstance("AES");
            SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
            random.setSeed(password.getBytes());
            kg.init(128, random);
            SecretKey secretKey = kg.generateKey();
            return new SecretKeySpec(secretKey.getEncoded(), "AES");
        } catch (NoSuchAlgorithmException var4) {
            Logger.getLogger(AESCipher.class.getName()).log(Level.SEVERE, null, var4);
            return null;
        }
    }
}
