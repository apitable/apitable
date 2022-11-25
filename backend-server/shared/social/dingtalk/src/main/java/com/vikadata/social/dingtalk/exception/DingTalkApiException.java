package com.vikadata.social.dingtalk.exception;

import static com.vikadata.social.dingtalk.exception.DingTalkExceptionConstants.INVALID_IP;
import static com.vikadata.social.dingtalk.exception.DingTalkExceptionConstants.INVALID_SIGN;
import static com.vikadata.social.dingtalk.exception.DingTalkExceptionConstants.INVALID_SUITE_TICKET;
import static com.vikadata.social.dingtalk.exception.DingTalkExceptionConstants.ISV_API_MAX_LIMIT_MINUTES;
import static com.vikadata.social.dingtalk.exception.DingTalkExceptionConstants.ISV_API_MAX_LIMIT_SECONDS;

/**
 * api exception
 *
 * @author Zoe Zheng
 * @date 2021-04-06 18:30:09
 */
public class DingTalkApiException extends RuntimeException {

    private static final long serialVersionUID = 8619308473051715042L;

    private final int code;

    public DingTalkApiException(String msg) {
        this(DingTalkExceptionConstants.UNKNOWN_EXCEPTION_ERR_CODE, msg);
    }

    public DingTalkApiException(int code, String msg) {
        super("code :" + code + ", " + msg);
        this.code = code;
    }

    public DingTalkApiException(int code, String msg, Throwable e) {
        super("code :" + code + ", " + msg, e);
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public Boolean isIllegalError() {
        return INVALID_IP == code || INVALID_SUITE_TICKET == code || INVALID_SIGN == code;
    }

    public Boolean isLimitError() {
        return ISV_API_MAX_LIMIT_MINUTES == code || ISV_API_MAX_LIMIT_SECONDS == code;
    }
}
