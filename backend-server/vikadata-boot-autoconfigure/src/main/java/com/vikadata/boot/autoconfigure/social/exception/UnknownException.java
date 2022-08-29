package com.vikadata.boot.autoconfigure.social.exception;

/**
 * @author Shawn Deng
 * @date 2020-11-19 10:40:04
 */
public class UnknownException extends ApiException {

    public UnknownException(String providerId, Throwable cause) {
        super(providerId, "Unknown Feishu Exception", cause);
    }

    public UnknownException(String providerId, String message, Throwable cause) {
        super(providerId, message, cause);
    }
}
