package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 * IDaaS Exception
 * </p>
 */
@Getter
@AllArgsConstructor
public enum  IdaasException implements BaseException {

    PARAM_INVALID(201, "wrong request parameter"),

    API_ERROR(210, "interface request exception"),

    APP_NOT_FOUND(220, "sso does not exist"),

    APP_SPACE_NOT_BIND(221, "The space station has not been bound with sso or has been unbound"),

    APP_SPACE_INVALID_BIND(222, "The binding information of the space station is abnormal"),

    USER_NOT_BIND(240, "The user has not been bound to single sign-on or has been unbound"),

    MEMBER_NOT_BIND(250, "The user has not been bound to single sign-on or has been unbound"),
    ;

    private final Integer code;

    private final String message;

}
