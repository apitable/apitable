package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 * authorization exception
 * </p>
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum AuthException implements BaseException {

    UNAUTHORIZED(201, "unauthorized or invalid access"),

    FORBIDDEN(202, "Insufficient permissions, forbidden to access the resource"),

    NONE_RESOURCE(203, "resource does not exist");

    private final Integer code;

    private final String message;
}
