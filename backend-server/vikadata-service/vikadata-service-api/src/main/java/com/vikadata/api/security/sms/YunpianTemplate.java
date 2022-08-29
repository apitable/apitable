package com.vikadata.api.security.sms;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 云片短信模板
 * </p>
 *
 * @author Chambers
 * @date 2021/5/11
 */
@Getter
@AllArgsConstructor
public enum YunpianTemplate {

    /**
     * 国际短信模板
     */
    INTERNATION_GENERAL("[vikadata] {}. This is your verification code, please used it in 15 minutes."),

    /**
     * 修改密码成功提示
     */
    UPDATE_PASSWORD_SUCCESS_NOTICE("[vikadata] You have successfully changed your password. If not your own operation, please change your account password in time.");

    private final String content;
}
