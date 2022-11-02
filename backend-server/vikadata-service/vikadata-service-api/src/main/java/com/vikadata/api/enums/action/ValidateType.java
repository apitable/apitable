package com.vikadata.api.enums.action;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * <p>
 * check type
 * </p>
 *
 * @author Chambers
 */
@Getter
public enum ValidateType {

    /**
     * sms verification code
     */
    SMS_CODE("sms_code"),

    /**
     * email verification code
     */
    EMAIL_CODE("email_code");

    @JsonValue
    private final String value;

    ValidateType(String value) {
        this.value = value;
    }
}
