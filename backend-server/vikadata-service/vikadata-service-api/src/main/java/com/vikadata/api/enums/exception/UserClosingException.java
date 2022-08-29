package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 * 账号注销相关的异常
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2022/1/11 09:49:07
 */
@Getter
@AllArgsConstructor
public enum UserClosingException implements BaseException {

    /**
     * 用户已经申请账号注销
     * */
    USER_APPLIED_FOR_CLOSING(960, "用户已申请账号注销"),

    /**
     * 用户已经撤销账号注销申请
     * */
    USER_CANCELED_CLOSING(961, "用户已撤销注销申请"),

    /**
     * 用户不满足账号注销条件，不允许发起注销申请
     * */
    USER_NOT_ALLOWED_TO_CLOSE(962, "不满足注销条件，不允许用户注销"),

    /**
     * 用户未发起注销，无法撤销注销申请
     * */
    USER_NOT_ALLOWED_CANCEL_CLOSING(963, "未发起注销申请，无法撤销注销"),

    /**
     * 用户已申请注销，但操作数据异常，无法计算出正式注销日期
     * */
    USER_HISTORY_RECORD_ISSUE(964, " 用户已申请注销，但操作数据异常，无法计算出正式注销日期");

    private final Integer code;

    private final String message;
}
