package com.vikadata.boot.autoconfigure.social.exception;

public class ApiException extends SocialException {

    /**
     * provider identify
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
