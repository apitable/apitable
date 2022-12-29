package com.apitable.starter.sensors.core;


import java.util.Map;

/**
 * <p>
 * Data Tracker
 * </p>
 *
 */
public interface DataTracker {

    /**
     * record events
     *
     * @param distinctId user's id
     * @param isLoginId  Is it a login ID, False indicates that the ID is an anonymous ID
     * @param eventName  event name
     * @param properties Properties of the event
     */
    void track(String distinctId, boolean isLoginId, String eventName, Map<String, Object> properties);

    /**
     * Log user registration events
     *
     * @param loginId     login ID
     * @param anonymousId anonymous ID
     */
    void trackSignUp(String loginId, String anonymousId);
}
