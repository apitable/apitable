package com.vikadata.api.control.exception;

import com.vikadata.api.control.ControlType;

public class UnknownControlTypeException extends RuntimeException {

    private final ControlType controlType;

    public UnknownControlTypeException(ControlType controlType) {
        super("Unknown Control Type");
        this.controlType = controlType;
    }

    public ControlType getControlType() {
        return controlType;
    }
}
