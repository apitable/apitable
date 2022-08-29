package com.vikadata.api.enums.action;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * <p>
 * 校验类型
 * </p>
 *
 * @author Chambers
 * @date 2021/6/15
 */
public enum ValidateType {

    /**
     * 短信验证码
     */
    SMS_CODE("sms_code"),

    /**
     * 邮件验证码
     */
    EMAIL_CODE("email_code");

    @JsonValue
    private final String value;

    ValidateType(String value) {
        this.value = value;
    }
}
