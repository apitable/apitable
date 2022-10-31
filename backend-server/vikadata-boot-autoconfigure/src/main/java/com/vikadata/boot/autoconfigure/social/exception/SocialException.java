package com.vikadata.boot.autoconfigure.social.exception;

public abstract class SocialException extends RuntimeException {

    public SocialException(String message) {
        super(message);
    }

    public SocialException(String message, Throwable cause) {
        super(message, cause);
    }
}
