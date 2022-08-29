package com.vikadata.api.control.request;

import com.vikadata.api.control.ControlRoleDict;

/**
 * 控制器请求
 * @author Shawn Deng
 * @date 2021-03-17 19:09:55
 */
public interface ControlRequest extends ControlAttribute {

    ControlRoleDict execute();
}
