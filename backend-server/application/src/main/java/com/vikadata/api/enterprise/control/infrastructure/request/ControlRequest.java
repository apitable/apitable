package com.vikadata.api.enterprise.control.infrastructure.request;

import com.vikadata.api.enterprise.control.infrastructure.ControlRoleDict;

/**
 * control request api
 * @author Shawn Deng
 */
public interface ControlRequest extends ControlAttribute {

    ControlRoleDict execute();
}
