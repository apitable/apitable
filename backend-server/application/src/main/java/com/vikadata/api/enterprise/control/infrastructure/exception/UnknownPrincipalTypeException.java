package com.vikadata.api.enterprise.control.infrastructure.exception;

import com.vikadata.api.enterprise.control.infrastructure.PrincipalType;

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
