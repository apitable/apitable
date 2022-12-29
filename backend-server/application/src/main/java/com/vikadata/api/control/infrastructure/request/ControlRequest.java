package com.vikadata.api.control.infrastructure.request;

import com.vikadata.api.control.infrastructure.ControlRoleDict;

/**
 * control request api
 * @author Shawn Deng
 */
public interface ControlRequest extends ControlAttribute {

    ControlRoleDict execute();
}
