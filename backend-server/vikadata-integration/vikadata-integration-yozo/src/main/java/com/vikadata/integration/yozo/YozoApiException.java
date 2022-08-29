package com.vikadata.integration.yozo;

/**
 *
 * @author Shawn Deng
 * @date 2021-06-22 10:52:06
 */
public class YozoApiException extends RuntimeException {

    public YozoApiException(String message) {
        super(message);
    }

    public YozoApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
