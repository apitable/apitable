package com.vikadata.api.base.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * login verification type
 * </p>
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum LoginType {

    /**
     * password
     */
    PASSWORD("password"),

    /**
     * sms code
     */
    SMS_CODE("sms_code"),

    /**
     * email code
     */
    EMAIL_CODE("email_code"),

    /**
     * sso auth
     */
    SSO_AUTH("sso_auth");

    @JsonValue
    private final String value;
}
