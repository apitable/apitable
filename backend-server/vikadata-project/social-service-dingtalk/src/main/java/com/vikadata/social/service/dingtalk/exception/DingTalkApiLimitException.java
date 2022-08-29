package com.vikadata.social.service.dingtalk.exception;

import com.vikadata.social.dingtalk.exception.DingTalkExceptionConstants;

/**
 * api 限流异常
 *
 * @author Zoe Zheng
 */
public class DingTalkApiLimitException extends RuntimeException {

    private static final long serialVersionUID = 8619308473051715042L;

    private final int code;

    public DingTalkApiLimitException(String msg) {
        this(DingTalkExceptionConstants.UNKNOWN_EXCEPTION_ERR_CODE, msg);
    }

    public DingTalkApiLimitException(int code, String msg) {
        super("code :" + code + ", " + msg);
        this.code = code;
    }

    public DingTalkApiLimitException(int code, String msg, Throwable e) {
        super("code :" + code + ", " + msg, e);
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
