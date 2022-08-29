package com.vikadata.api.enums.exception;

import com.vikadata.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * ParameterException
 * 参数相关异常状态码
 * 状态码范围（220-229）
 *
 * @author Chambers
 * @since 2019/10/29
 */
@Getter
@AllArgsConstructor
public enum ParameterException implements BaseException {

    /**
     * 没有参数
     */
    NO_ARG(220, "没有参数"),

    /**
     * 参数有误
     */
    INCORRECT_ARG(221, "参数有误");

    private final Integer code;

    private final String message;
}
