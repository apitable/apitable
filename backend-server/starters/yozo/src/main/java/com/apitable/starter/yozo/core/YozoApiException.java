package com.apitable.starter.yozo.core;

public class YozoApiException extends RuntimeException {

    public YozoApiException(String message) {
        super(message);
    }

    public YozoApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
