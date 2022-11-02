package com.vikadata.api.enums.action;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * buried event type
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum TrackEventType {

    /**
     * get the verification code successfully
     */
    GET_SMC_CODE("authGetCodeResult"),

    /**
     * registration success
     */
    REGISTER("registerSuccess"),

    /**
     * initialized nickname succeeded
     */
    SET_NICKNAME("setNameSuccess"),

    /**
     * login successful
     */
    LOGIN("loginSuccess"),

    /**
     * search template
     */
    SEARCH_TEMPLATE("searchTemplate");


    private final String eventName;
}
