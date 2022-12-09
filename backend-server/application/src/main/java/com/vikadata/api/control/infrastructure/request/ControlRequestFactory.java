package com.vikadata.api.control.infrastructure.request;

import java.util.List;

import com.vikadata.api.control.infrastructure.ControlType;

public interface ControlRequestFactory {

    ControlType getControlType();

    ControlRequest create(List<Long> units, List<String> controlIds);
}
