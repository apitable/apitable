package com.vikadata.api.enterprise.appstore.model;

import com.vikadata.api.enterprise.appstore.enums.AppType;

/**
 * Instance configuration interface
 */
public interface InstanceConfig {

    /**
     * Instance Detailed Settings
     */
    InstanceConfigProfile getProfile();

    /**
     * Application Type
     */
    AppType getType();

    /**
     * Output json string
     * @return Json String
     */
    String toJsonString();
}
