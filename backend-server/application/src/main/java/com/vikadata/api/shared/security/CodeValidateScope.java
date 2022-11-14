package com.vikadata.api.shared.security;

/**
 * <p>
 * global captcha business type scope
 * </p>
 *
 * @author Shawn Deng
 */
public enum CodeValidateScope {

    REGISTER,

    LOGIN,

    UPDATE_PWD,

    BOUND_MOBILE,

    UN_BOUND_MOBILE,

    UPDATE_EMAIL,

    BOUND_EMAIL,

    REGISTER_EMAIL,

    COMMON_VERIFICATION,

    DEL_SPACE,

    UPDATE_MAIN_ADMIN,

    BOUND_DINGTALK,

    GENERAL_VERIFICATION,

    RESET_API_KEY,

    SOCIAL_USER_BIND;

    public static CodeValidateScope fromName(String name) {
        CodeValidateScope scope = null;
        for (CodeValidateScope ele : CodeValidateScope.values()) {
            if (ele.name().equalsIgnoreCase(name)) {
                scope = ele;
                break;
            }
        }

        if (scope == null) {
            throw new IllegalArgumentException("unknown captcha type");
        }

        return scope;
    }
}
