package com.vikadata.social.feishu.util;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * 飞书推送数据 解密
 *
 * @author Shawn Deng
 * @date 2020-11-19 17:49:11
 */
public class FeishuDecryptor {

    private byte[] key;

    public FeishuDecryptor(String encryptKey) {
        MessageDigest digest;
        try {
            digest = MessageDigest.getInstance("SHA-256");
            key = digest.digest(encryptKey.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            // 不会发生的，除非你乱填 algorithm
        }
    }

    /**
     * 解密
     *
     * @param encryptData 加密数据
     * @return 解密数据
     * @throws InvalidAlgorithmParameterException 非法算法
     * @throws InvalidKeyException                非法值
     * @throws BadPaddingException                异常
     * @throws IllegalBlockSizeException          异常
     * @throws NoSuchPaddingException             异常
     * @throws NoSuchAlgorithmException           异常
     */
    public String decrypt(String encryptData) throws InvalidAlgorithmParameterException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException, NoSuchPaddingException, NoSuchAlgorithmException {

        byte[] decode = Base64.getDecoder().decode(encryptData);

        Cipher cipher = Cipher.getInstance("AES/CBC/NOPADDING");

        byte[] iv = new byte[16];
        System.arraycopy(decode, 0, iv, 0, 16);

        byte[] data = new byte[decode.length - 16];
        System.arraycopy(decode, 16, data, 0, data.length);

        cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key, "AES"), new IvParameterSpec(iv));

        byte[] r = cipher.doFinal(data);
        if (r.length > 0) {
            int p = r.length - 1;
            while (p >= 0 && r[p] < 16) {
                p--;
            }
            if (p != r.length - 1) {
                byte[] rr = new byte[p + 1];
                System.arraycopy(r, 0, rr, 0, p + 1);
                r = rr;
            }
        }

        return new String(r, StandardCharsets.UTF_8);
    }
}
