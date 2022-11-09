package com.apitable.starter.vika.core.model;

import java.util.List;

/**
 * <p>
 * GM Permission configuration information
 * </p>
 *
 */
public class GmPermissionInfo {

    private String action;

    private List<Long> unitIds;

    public GmPermissionInfo() {
    }

    public GmPermissionInfo(String resourceCode, List<Long> unitIds) {
        this.action = resourceCode;
        this.unitIds = unitIds;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public List<Long> getUnitIds() {
        return unitIds;
    }

    public void setUnitIds(List<Long> unitIds) {
        this.unitIds = unitIds;
    }
}
