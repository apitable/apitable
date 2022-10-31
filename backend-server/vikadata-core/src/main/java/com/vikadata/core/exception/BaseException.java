package com.vikadata.core.exception;

/**
 * <p>
 * Interface: Base Exception Convention
 * </p>
 */
public interface BaseException {

    /**
     * Exception Status Code
     *
     * @return Integer
     */
    Integer getCode();

    /**
     * Exception Message
     *
     * @return String
     */
    String getMessage();
}
