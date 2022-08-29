package com.vikadata.boot.autoconfigure.social.exception;

/**
 * @author Shawn Deng
 * @date 2020-11-19 10:31:07
 */
public class UnAuthorizationException extends ApiException {

    public UnAuthorizationException(String providerId, String message) {
        super(providerId, message);
    }
}
