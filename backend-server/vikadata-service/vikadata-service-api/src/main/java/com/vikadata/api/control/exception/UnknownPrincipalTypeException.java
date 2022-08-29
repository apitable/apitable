package com.vikadata.api.control.exception;

import com.vikadata.api.control.PrincipalType;

/**
 *
 * @author Shawn Deng
 * @date 2021-03-19 17:28:26
 */
public class UnknownPrincipalTypeException extends RuntimeException {

    private final PrincipalType principalType;

    public UnknownPrincipalTypeException(PrincipalType principalType) {
        super("未知的权限资源控制凭证：" + principalType);
        this.principalType = principalType;
    }
}
