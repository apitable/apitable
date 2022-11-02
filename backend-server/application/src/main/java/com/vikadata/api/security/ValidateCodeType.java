package com.vikadata.api.security;

import com.vikadata.api.enums.action.LoginType;

/**
 * <p>
 * verification code type
 * </p>
 *
 * @author Shawn Deng
 */
public enum ValidateCodeType {

    SMS {
        @Override
        public String getParamNameOnValidate() {
            return LoginType.SMS_CODE.getValue();
        }
    },

    EMAIL {
        @Override
        public String getParamNameOnValidate() {
            return LoginType.EMAIL_CODE.getValue();
        }
    };

    public abstract String getParamNameOnValidate();
}
