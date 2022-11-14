package com.vikadata.api.enterprise.control.infrastructure;

import com.vikadata.api.enterprise.control.infrastructure.request.ControlRequest;

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
