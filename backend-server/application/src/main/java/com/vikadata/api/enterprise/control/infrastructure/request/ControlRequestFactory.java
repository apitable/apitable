package com.vikadata.api.enterprise.control.infrastructure.request;

import java.util.List;

import com.vikadata.api.enterprise.control.infrastructure.ControlType;

public interface ControlRequestFactory {

    ControlType getControlType();

    ControlRequest create(List<Long> units, List<String> controlIds);
}
