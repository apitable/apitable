package com.vikadata.api.control.exception;

import com.vikadata.api.control.ControlType;

/**
 *
 * @author Shawn Deng
 * @date 2021-03-19 17:28:26
 */
public class UnknownControlTypeException extends RuntimeException {

    private final ControlType controlType;

    public UnknownControlTypeException(ControlType controlType) {
        super("未知的权限资源控制类型");
        this.controlType = controlType;
    }
}
