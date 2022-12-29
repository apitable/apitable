package com.vikadata.api.control.infrastructure;

import com.vikadata.api.control.infrastructure.request.ControlRequest;

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
