package com.vikadata.social.dingtalk.exception;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 钉钉加解密异常
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 11:48 上午
 */
public class DingTalkEncryptException extends Exception {
    public static final int SUCCESS = 0;

    public static final int ENCRYPTION_PLAINTEXT_ILLEGAL = 900001;

    public static final int ENCRYPTION_TIMESTAMP_ILLEGAL = 900002;

    public static final int ENCRYPTION_NONCE_ILLEGAL = 900003;

    public static final int AES_KEY_ILLEGAL = 900004;

    public static final int SIGNATURE_NOT_MATCH = 900005;

    public static final int COMPUTE_SIGNATURE_ERROR = 900006;

    public static final int COMPUTE_ENCRYPT_TEXT_ERROR = 900007;

    public static final int COMPUTE_DECRYPT_TEXT_ERROR = 900008;

    public static final int COMPUTE_DECRYPT_TEXT_LENGTH_ERROR = 900009;

    public static final int COMPUTE_DECRYPT_TEXT_CORPID_ERROR = 900010;

    public static final int TOKEN_ILLEGAL = 900011;

    private static final long serialVersionUID = 2323750120160188719L;

    private static final Map<Integer, String> MSG_MAP = new HashMap<>();

    private final Integer code;

    static {
        MSG_MAP.put(0, "成功");
        MSG_MAP.put(900001, "加密明文文本非法");
        MSG_MAP.put(900002, "加密时间戳参数非法");
        MSG_MAP.put(900003, "加密随机字符串参数非法");
        MSG_MAP.put(900005, "签名不匹配");
        MSG_MAP.put(900006, "签名计算失败");
        MSG_MAP.put(900004, "不合法的aes key");
        MSG_MAP.put(900007, "计算加密文字错误");
        MSG_MAP.put(900008, "计算解密文字错误");
        MSG_MAP.put(900009, "计算解密文字长度不匹配");
        MSG_MAP.put(900010, "计算解密文字corpid不匹配");
        MSG_MAP.put(900011, "不合法的token");
    }

    public Integer getCode() {
        return this.code;
    }

    public DingTalkEncryptException(Integer exceptionCode) {
        super(MSG_MAP.get(exceptionCode));
        this.code = exceptionCode;
    }
}