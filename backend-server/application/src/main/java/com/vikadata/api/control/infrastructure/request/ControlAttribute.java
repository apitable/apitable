package com.vikadata.api.control.infrastructure.request;

import java.util.List;

import com.vikadata.api.control.infrastructure.ControlType;

/**
 * control attribute definition
 * @author Shawn Deng
 */
public interface ControlAttribute {

    /**
     * get unit id of control
     * @return unit id of organization
     */
    List<Long> getUnits();

    /**
     * get control id list
     * @return control id list
     */
    List<String> getControlIds();

    /**
     * get control type
     * @return control type
     */
    ControlType getType();
}
