package com.vikadata.api.control.request;

import java.util.List;

import com.vikadata.api.control.ControlType;
import com.vikadata.api.control.request.ControlRequest;

/**
 *
 * @author Shawn Deng
 * @date 2021-03-17 19:41:23
 */
public interface ControlRequestFactory {

    ControlType getControlType();

    ControlRequest create(List<Long> units, List<String> controlIds);
}
