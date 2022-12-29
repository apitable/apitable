package com.vikadata.api.control.infrastructure.request;

import java.util.List;

import com.vikadata.api.control.infrastructure.ControlType;

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
