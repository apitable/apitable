package com.vikadata.api.control.request;

import java.util.List;

import com.vikadata.api.control.ControlType;

/**
 *
 * @author Shawn Deng
 * @date 2021-03-17 19:43:28
 */
public class NodeControlRequestFactory implements ControlRequestFactory {

    @Override
    public ControlType getControlType() {
        return ControlType.NODE;
    }

    @Override
    public ControlRequest create(List<Long> units, List<String> controlIds) {
        return new NodeControlRequest(units, controlIds);
    }
}
