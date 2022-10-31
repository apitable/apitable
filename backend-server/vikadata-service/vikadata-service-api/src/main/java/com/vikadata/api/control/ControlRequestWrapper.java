package com.vikadata.api.control;

import com.vikadata.api.control.request.ControlRequest;

/**
 * control request wrapper
 * @author Shawn Deng
 */
public interface ControlRequestWrapper {

    /**
     * wrapper request
     * @param request ControlRequest
     */
    void doWrapper(ControlRequest request);
}
