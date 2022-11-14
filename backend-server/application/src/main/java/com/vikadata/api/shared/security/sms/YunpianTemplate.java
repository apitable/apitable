package com.vikadata.api.shared.security.sms;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * yunpian sms template
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum YunpianTemplate {

    /**
     * internation
     */
    INTERNATION_GENERAL("[vikadata] {}. This is your verification code, please used it in 15 minutes."),

    /**
     * notification for update password success
     */
    UPDATE_PASSWORD_SUCCESS_NOTICE("[vikadata] You have successfully changed your password. If not your own operation, please change your account password in time.");

    private final String content;
}
