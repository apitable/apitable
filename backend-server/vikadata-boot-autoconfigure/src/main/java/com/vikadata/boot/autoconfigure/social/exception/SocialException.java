package com.vikadata.boot.autoconfigure.social.exception;

/**
 * @author Shawn Deng
 * @date 2020-11-19 10:25:50
 */
public abstract class SocialException extends RuntimeException {

    public SocialException(String message) {
        super(message);
    }

    public SocialException(String message, Throwable cause) {
        super(message, cause);
    }
}
