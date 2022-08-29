package com.vikadata.api.security;

import com.vikadata.api.enums.action.LoginType;

/**
 * <p>
 * 验证码类型
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/25 14:55
 */
public enum ValidateCodeType {

    /**
     * 短信验证码
     */
    SMS {
        @Override
        public String getParamNameOnValidate() {
            return LoginType.SMS_CODE.getValue();
        }
    },

    /**
     * 邮箱验证码
     */
    EMAIL {
        @Override
        public String getParamNameOnValidate() {
            return LoginType.EMAIL_CODE.getValue();
        }
    };

    /**
     * 校验时从请求中获取的参数的名字
     *
     * @return param name on validate
     */
    public abstract String getParamNameOnValidate();
}
