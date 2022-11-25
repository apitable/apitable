package com.vikadata.social.dingtalk.exception;

import java.util.HashMap;
import java.util.Map;

/**
 * DingTalk encryption and decryption exception
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

    static {
        MSG_MAP.put(0, "success");
        MSG_MAP.put(900001, "Encrypted plaintext is illegal");
        MSG_MAP.put(900002, "The encrypted timestamp parameter is illegal");
        MSG_MAP.put(900003, "The encrypted random string parameter is illegal");
        MSG_MAP.put(900005, "Signature does not match");
        MSG_MAP.put(900006, "Signature calculation failed");
        MSG_MAP.put(900004, "invalid aes key");
        MSG_MAP.put(900007, "Error calculating encrypted text");
        MSG_MAP.put(900008, "Error in calculating decrypted text");
        MSG_MAP.put(900009, "Calculate decrypted text length mismatch");
        MSG_MAP.put(900010, "Compute decrypted literal corpid mismatch");
        MSG_MAP.put(900011, "illegal token");
    }

    private final Integer code;

    public DingTalkEncryptException(Integer exceptionCode) {
        super(MSG_MAP.get(exceptionCode));
        this.code = exceptionCode;
    }

    public Integer getCode() {
        return this.code;
    }
}