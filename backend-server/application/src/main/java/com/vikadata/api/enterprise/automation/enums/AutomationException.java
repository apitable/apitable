package com.vikadata.api.enterprise.automation.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 * automation exception
 * </p>
 *
 * @author feng penglong
 */
@Getter
@AllArgsConstructor
public enum AutomationException implements BaseException {

    DST_ROBOT_LIMIT(1101, "The single-table robot has reached the upper limit"),

    DST_ROBOT_REPEAT(1102, "Do not recreate");

    private final Integer code;

    private final String message;
}
