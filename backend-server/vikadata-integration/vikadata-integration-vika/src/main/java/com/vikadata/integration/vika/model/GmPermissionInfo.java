package com.vikadata.integration.vika.model;

import java.util.List;

/**
 * <p>
 * GM 权限配置信息
 * </p>
 *
 * @author Chambers
 * @date 2021/3/25
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
