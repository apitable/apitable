package com.vikadata.social.dingtalk.util;

import java.io.ByteArrayOutputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import com.vikadata.social.dingtalk.exception.DingTalkEncryptException;


/**
 * <p>
 *  钉钉开放平台加解密方法
 *  Cut & paste from open-dingtalk/dingtalk-callback-Crypto
 * </p>
 * @author zoe zheng
 * @date 2021/5/6 10:20 上午
 */
public class DingTalkCallbackCrypto {

    private final byte[] aesKey;

    private final String token;

    private final String corpId;

    /**
     * ask getPaddingBytes key固定长度
     **/
    public static final Integer AES_ENCODE_KEY_LENGTH = 43;

    /**
     * token的固定长度
     */
    public static final Integer TOKEN_KEY_LENGTH = 32;

    /**
     * 加密随机字符串字节长度
     **/
    private static final Integer RANDOM_LENGTH = 16;

    /**
     * 构造函数
     *
     * @param token          钉钉开放平台上，开发者设置的token
     * @param encodingAesKey 钉钉开放台上，开发者设置的EncodingAESKey
     * @param corpId         企业自建应用-事件订阅, 使用appKey
     *                       企业自建应用-注册回调地址, 使用customKey
     *                       第三方企业应用, 使用suiteKey
     *
     * @throws DingTalkEncryptException 执行失败，请查看该异常的错误码和具体的错误信息
     */
    public DingTalkCallbackCrypto(String token, String encodingAesKey, String corpId) throws DingTalkEncryptException {
        if (null == encodingAesKey || encodingAesKey.length() != AES_ENCODE_KEY_LENGTH) {
            throw new DingTalkEncryptException(DingTalkEncryptException.AES_KEY_ILLEGAL);
        }
        if (null == token || token.length() != TOKEN_KEY_LENGTH) {
            throw new DingTalkEncryptException(DingTalkEncryptException.TOKEN_ILLEGAL);
        }
        this.token = token;
        this.corpId = corpId;
        aesKey = Base64.getDecoder().decode(encodingAesKey + "=");
    }

    public Map<String, String> getEncryptedMap(String plaintext) throws DingTalkEncryptException {
        return getEncryptedMap(plaintext, System.currentTimeMillis(), Utils.getRandomStr(16));
    }

    /**
     * 将和钉钉开放平台同步的消息体加密,返回加密Map
     *
     * @param plaintext 传递的消息体明文
     * @param timeStamp 时间戳
     * @param nonce     随机字符串
     * @return Map<String, String>
     * @throws DingTalkEncryptException 钉钉加密异常
     */
    public Map<String, String> getEncryptedMap(String plaintext, Long timeStamp, String nonce)
            throws DingTalkEncryptException {
        if (null == plaintext) {
            throw new DingTalkEncryptException(DingTalkEncryptException.ENCRYPTION_PLAINTEXT_ILLEGAL);
        }
        if (null == timeStamp) {
            throw new DingTalkEncryptException(DingTalkEncryptException.ENCRYPTION_TIMESTAMP_ILLEGAL);
        }
        if (null == nonce || nonce.length() != 16) {
            throw new DingTalkEncryptException(DingTalkEncryptException.ENCRYPTION_NONCE_ILLEGAL);
        }
        // 加密
        String encrypt = encrypt(Utils.getRandomStr(RANDOM_LENGTH), plaintext);
        String signature = getSignature(token, String.valueOf(timeStamp), nonce, encrypt);
        Map<String, String> resultMap = new HashMap<>();
        resultMap.put("msg_signature", signature);
        resultMap.put("encrypt", encrypt);
        resultMap.put("timeStamp", String.valueOf(timeStamp));
        resultMap.put("nonce", nonce);
        return resultMap;
    }

    /**
     * 密文解密
     *
     * @param msgSignature 签名串
     * @param timeStamp    时间戳
     * @param nonce        随机串
     * @param encryptMsg   密文
     * @return 解密后的原文
     * @throws DingTalkEncryptException 钉钉加密异常
     */
    public String getDecryptMsg(String msgSignature, String timeStamp, String nonce, String encryptMsg)
            throws DingTalkEncryptException {
        //校验签名
        String signature = getSignature(token, timeStamp, nonce, encryptMsg);
        if (!signature.equals(msgSignature)) {
            throw new DingTalkEncryptException(DingTalkEncryptException.COMPUTE_SIGNATURE_ERROR);
        }
        // 解密
        return decrypt(encryptMsg);
    }

    /**
     * 对明文加密
     *
     * @param random 加密随机字符串
     * @param plaintext 需要加密的明文
     * @return 加密后base64编码的字符串
     * @author zoe zheng
     * @date 2021/5/13 11:44 上午
     */
    private String encrypt(String random, String plaintext) throws DingTalkEncryptException {
        try {
            byte[] randomBytes = random.getBytes(StandardCharsets.UTF_8);
            byte[] plainTextBytes = plaintext.getBytes(StandardCharsets.UTF_8);
            byte[] lengthByte = Utils.int2Bytes(plainTextBytes.length);
            byte[] corpidBytes = corpId.getBytes(StandardCharsets.UTF_8);
            ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
            byteStream.write(randomBytes);
            byteStream.write(lengthByte);
            byteStream.write(plainTextBytes);
            byteStream.write(corpidBytes);
            byte[] padBytes = PKCS7Padding.getPaddingBytes(byteStream.size());
            byteStream.write(padBytes);
            byte[] unencrypted = byteStream.toByteArray();
            byteStream.close();
            Cipher cipher = Cipher.getInstance("AES/CBC/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(aesKey, "AES");
            IvParameterSpec iv = new IvParameterSpec(aesKey, 0, 16);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, iv);
            byte[] encrypted = cipher.doFinal(unencrypted);
            return Base64.getEncoder().encodeToString(encrypted);
        }
        catch (Exception e) {
            throw new DingTalkEncryptException(DingTalkEncryptException.COMPUTE_ENCRYPT_TEXT_ERROR);
        }
    }

    /*
     * 对密文进行解密.
     * @param text 需要解密的密文
     * @return 解密得到的明文
     */
    private String decrypt(String text) throws DingTalkEncryptException {
        byte[] originalArr;
        try {
            // 设置解密模式为AES的CBC模式
            Cipher cipher = Cipher.getInstance("AES/CBC/NoPadding");
            SecretKeySpec keySpec = new SecretKeySpec(aesKey, "AES");
            IvParameterSpec iv = new IvParameterSpec(Arrays.copyOfRange(aesKey, 0, 16));
            cipher.init(Cipher.DECRYPT_MODE, keySpec, iv);
            // 使用BASE64对密文进行解码
            byte[] encrypted = Base64.getDecoder().decode(text);
            // 解密
            originalArr = cipher.doFinal(encrypted);
        }
        catch (Exception e) {
            throw new DingTalkEncryptException(DingTalkEncryptException.COMPUTE_DECRYPT_TEXT_ERROR);
        }

        String plainText;
        String fromCorpid;
        try {
            // 去除补位字符
            byte[] bytes = PKCS7Padding.removePaddingBytes(originalArr);
            // 分离16位随机字符串,网络字节序和corpId
            byte[] networkOrder = Arrays.copyOfRange(bytes, 16, 20);
            int plainTextLegth = Utils.bytes2int(networkOrder);
            plainText = new String(Arrays.copyOfRange(bytes, 20, 20 + plainTextLegth), StandardCharsets.UTF_8);
            fromCorpid = new String(Arrays.copyOfRange(bytes, 20 + plainTextLegth, bytes.length), StandardCharsets.UTF_8);
        }
        catch (Exception e) {
            throw new DingTalkEncryptException(DingTalkEncryptException.COMPUTE_DECRYPT_TEXT_LENGTH_ERROR);
        }

        // corpid不相同的情况
        if (!fromCorpid.equals(corpId)) {
            throw new DingTalkEncryptException(DingTalkEncryptException.COMPUTE_DECRYPT_TEXT_CORPID_ERROR);
        }
        return plainText;
    }

    /**
     * 数字签名
     *
     * @param token     isv token
     * @param timestamp 时间戳
     * @param nonce     随机串
     * @param encrypt   加密文本
     * @return
     * @throws DingTalkEncryptException
     */
    public String getSignature(String token, String timestamp, String nonce, String encrypt)
            throws DingTalkEncryptException {
        try {
            String[] array = new String[] { token, timestamp, nonce, encrypt };
            Arrays.sort(array);
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < 4; i++) {
                sb.append(array[i]);
            }
            String str = sb.toString();
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            md.update(str.getBytes());
            byte[] digest = md.digest();

            StringBuffer hexstr = new StringBuffer();
            String shaHex = "";
            for (int i = 0; i < digest.length; i++) {
                shaHex = Integer.toHexString(digest[i] & 0xFF);
                if (shaHex.length() < 2) {
                    hexstr.append(0);
                }
                hexstr.append(shaHex);
            }
            return hexstr.toString();
        }
        catch (Exception e) {
            throw new DingTalkEncryptException(DingTalkEncryptException.COMPUTE_SIGNATURE_ERROR);
        }
    }

    public static class Utils {
        public Utils() {
        }

        public static String getRandomStr(int count) {
            String base = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Random random = new Random();
            StringBuffer sb = new StringBuffer();

            for (int i = 0; i < count; ++i) {
                int number = random.nextInt(base.length());
                sb.append(base.charAt(number));
            }

            return sb.toString();
        }

        public static byte[] int2Bytes(int count) {
            byte[] byteArr = new byte[] { (byte) (count >> 24 & 255), (byte) (count >> 16 & 255), (byte) (count >> 8 & 255),
                    (byte) (count & 255) };
            return byteArr;
        }

        public static int bytes2int(byte[] byteArr) {
            int count = 0;

            for (int i = 0; i < 4; ++i) {
                count <<= 8;
                count |= byteArr[i] & 255;
            }

            return count;
        }
    }

    public static class PKCS7Padding {
        private static final Charset CHARSET = StandardCharsets.UTF_8;

        private static final int BLOCK_SIZE = 32;

        public PKCS7Padding() {
        }

        public static byte[] getPaddingBytes(int count) {
            int amountToPad = 32 - count % 32;

            char padChr = chr(amountToPad);
            String tmp = "";

            for (int index = 0; index < amountToPad; ++index) {
                tmp = tmp + padChr;
            }

            return tmp.getBytes(CHARSET);
        }

        public static byte[] removePaddingBytes(byte[] decrypted) {
            int pad = decrypted[decrypted.length - 1];
            if (pad < 1 || pad > 32) {
                pad = 0;
            }

            return Arrays.copyOfRange(decrypted, 0, decrypted.length - pad);
        }

        private static char chr(int a) {
            byte target = (byte) (a & 255);
            return (char) target;
        }
    }
}
