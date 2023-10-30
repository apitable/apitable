package com.apitable.shared.exception;

import com.apitable.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * limit exception.
 *
 * @author Shawn Deng
 */
@Getter
@AllArgsConstructor
public enum LimitException implements BaseException {

    OVER_LIMIT(1501, "exceed over limit"),

    WIDGET_OVER_LIMIT(1502, "widget nums over limit"),

    SEATS_OVER_LIMIT(1503, "seat nums over limit"),

    CREDIT_OVER_LIMIT(1504, "credit over limit");

    private final Integer code;

    private final String message;
}
