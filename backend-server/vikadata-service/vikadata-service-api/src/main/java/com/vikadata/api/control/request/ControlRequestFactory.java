package com.vikadata.api.control.request;

import java.util.List;

import com.vikadata.api.control.ControlType;

public interface ControlRequestFactory {

    ControlType getControlType();

    ControlRequest create(List<Long> units, List<String> controlIds);
}
