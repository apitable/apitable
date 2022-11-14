package com.vikadata.api.enterprise.control.infrastructure.request;

import java.util.List;

import com.vikadata.api.enterprise.control.infrastructure.ControlType;

public class FieldControlRequestFactory implements ControlRequestFactory {

    @Override
    public ControlType getControlType() {
        return ControlType.DATASHEET_FIELD;
    }

    @Override
    public ControlRequest create(List<Long> units, List<String> controlIds) {
        return new FieldControlRequest(units, controlIds);
    }
}
