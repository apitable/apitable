package com.vikadata.api.enums.action;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * <p>
 * 登录验证类型
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/24 16:48
 */
public enum LoginType {

    /**
     * 密码
     */
    PASSWORD("password"),

    /**
     * 短信验证码
     */
    SMS_CODE("sms_code"),

    /**
     * 邮件验证码
     */
    EMAIL_CODE("email_code"),

	/**
	 * 微信小程序短信验证码
	 */
	WECHAT_SMS_CODE("wechat_sms_code"),

    /**
     * sso 身份认证
     */
    SSO_AUTH("sso_auth");

    @JsonValue
    private final String value;

    LoginType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
