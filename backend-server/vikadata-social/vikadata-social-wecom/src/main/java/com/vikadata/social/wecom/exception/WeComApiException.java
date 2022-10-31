package com.vikadata.social.wecom.exception;

/**
 * Enterprise WeChat calls API exception
 */
public class WeComApiException extends RuntimeException {

    private final int code;

    public WeComApiException(String msg) {
        this(WeComExceptionConstants.UNKNOWN_EXCEPTION_ERR_CODE, msg);
    }

    public WeComApiException(int code, String msg) {
        super("code :" + code + ", " + msg);
        this.code = code;
    }

    public WeComApiException(int code, String msg, Throwable e) {
        super("code :" + code + ", " + msg, e);
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
