package com.vikadata.social.feishu.exception;

/**
 * @author Shawn Deng
 * @date 2020-11-21 23:30:35
 */
public class FeishuApiException extends RuntimeException {

    private final int code;

    public FeishuApiException(String msg) {
        this(FeishuExceptionConstants.UNKNOWN_EXCEPTION_ERR_CODE, msg);
    }

    public FeishuApiException(int code, String msg) {
        super("code :" + code + ", " + msg);
        this.code = code;
    }

    public FeishuApiException(int code, String msg, Throwable e) {
        super("code :" + code + ", " + msg, e);
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
