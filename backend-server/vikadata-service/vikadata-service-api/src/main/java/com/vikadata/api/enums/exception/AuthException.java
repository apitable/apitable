package com.vikadata.api.enums.exception;

import com.vikadata.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 授权异常
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/27 14:37
 */
@Getter
@AllArgsConstructor
public enum AuthException implements BaseException {

    /**
     * 未授权或者访问失效
     */
    UNAUTHORIZED(201, "未授权或者访问失效"),

    /**
     * 权限不足,禁止访问资源
     */
    FORBIDDEN(202, "权限不足,禁止访问资源"),

    /**
     * 资源不存在
     */
    NONE_RESOURCE(203, "资源不存在");

    private final Integer code;

    private final String message;
}
