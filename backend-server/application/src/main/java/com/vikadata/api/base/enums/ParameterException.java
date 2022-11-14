package com.vikadata.api.base.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * Parameter Exception
 * status code range（220-229）
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum ParameterException implements BaseException {

    NO_ARG(220, "no parameters"),

    INCORRECT_ARG(221, "wrong parameter");

    private final Integer code;

    private final String message;
}
