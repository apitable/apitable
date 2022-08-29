package com.vikadata.api.control.permission;

/**
 *
 * @author Shawn Deng
 * @date 2021-03-18 15:15:35
 */
public interface PermissionDefinition {

    int getGroup();

    String getCode();

    long getValue();
}
