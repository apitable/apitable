package com.vikadata.boot.autoconfigure.social.exception;

/**
 * @author Shawn Deng
 * @date 2020-11-19 10:44:49
 */
public class AuthorizationExpireException extends ApiException {

    public AuthorizationExpireException(String providerId) {
        super(providerId, "授权已过期");
    }
}
