package com.vikadata.api.control.request;

import com.vikadata.api.control.ControlRoleDict;

/**
 * control request api
 * @author Shawn Deng
 */
public interface ControlRequest extends ControlAttribute {

    ControlRoleDict execute();
}
