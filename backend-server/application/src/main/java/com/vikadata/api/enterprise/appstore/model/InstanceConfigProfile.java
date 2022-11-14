package com.vikadata.api.enterprise.appstore.model;

/**
 * Instance configuration settings
 */
public interface InstanceConfigProfile {

    /**
     * App ID
     */
    String getAppKey();

    /**
     * App Key
     */
    String getAppSecret();

    /**
     * Convert to JSON string
     */
    String toJsonString();
}
