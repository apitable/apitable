package com.vikadata.boot.autoconfigure.social.exception;

/**
 * @author Shawn Deng
 * @date 2020-11-19 10:28:15
 */
public class ApiException extends SocialException {

    /**
     * 提供方
     */
    private final String providerId;

    public ApiException(String providerId, String message) {
        this(providerId, message, null);
    }

    public ApiException(String providerId, String message, Throwable cause) {
        super(message, cause);
        this.providerId = providerId;
    }

    public String getProviderId() {
        return providerId;
    }
}
