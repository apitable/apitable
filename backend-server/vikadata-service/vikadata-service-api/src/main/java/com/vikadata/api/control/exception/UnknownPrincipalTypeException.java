package com.vikadata.api.control.exception;

import com.vikadata.api.control.PrincipalType;

public class UnknownPrincipalTypeException extends RuntimeException {

    private final PrincipalType principalType;

    public UnknownPrincipalTypeException(PrincipalType principalType) {
        super("Unknown Principal Type: " + principalType);
        this.principalType = principalType;
    }

    public PrincipalType getPrincipalType() {
        return principalType;
    }
}
