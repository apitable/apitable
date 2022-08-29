package com.vikadata.api.control;

import com.vikadata.api.control.request.ControlRequest;

/**
 * 控制权限请求包装
 * @author Shawn Deng
 * @date 2021-04-01 15:57:36
 */
public interface ControlRequestWrapper {

    /**
     * 包装请求
     * @param request ControlRequest
     */
    void doWrapper(ControlRequest request);
}
