package com.vikadata.api.control.request;

import java.util.List;

import com.vikadata.api.control.ControlType;

/**
 * 控制器属性
 * @author Shawn Deng
 * @date 2021-03-17 19:06:21
 */
public interface ControlAttribute {

    /**
     * 权限控制机凭证
     * @return 用户凭证
     */
    List<Long> getUnits();

    /**
     * 权限控制单位
     * @return 控制机对象
     */
    List<String> getControlIds();

    /**
     * 权限控制单位类型
     * @return 权限控制单位类型
     */
    ControlType getType();
}
