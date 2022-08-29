package com.vikadata.boot.autoconfigure.social.exception;

/**
 * @author Shawn Deng
 * @date 2020-11-19 10:39:10
 */
public class InvalidParameterException extends ApiException {

    public InvalidParameterException(String providerId, String message) {
        super(providerId, message);
    }
}
