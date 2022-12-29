package com.vikadata.api.interfaces.widget.model;

import java.util.Map;

import com.vikadata.api.workspace.dto.DatasheetWidgetDTO;

public class WidgetCopyOption {

    private Long userId;

    private String destSpaceId;

    private Map<String, String> newNodeMap;

    private Map<String, String> newWidgetIdMap;

    private Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap;

    public WidgetCopyOption(Long userId, String destSpaceId, Map<String, String> newNodeMap, Map<String, String> newWidgetIdMap, Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap) {
        this.userId = userId;
        this.destSpaceId = destSpaceId;
        this.newNodeMap = newNodeMap;
        this.newWidgetIdMap = newWidgetIdMap;
        this.newWidgetIdToDstMap = newWidgetIdToDstMap;
    }

    public Long getUserId() {
        return userId;
    }

    public String getDestSpaceId() {
        return destSpaceId;
    }

    public Map<String, String> getNewNodeMap() {
        return newNodeMap;
    }

    public Map<String, String> getNewWidgetIdMap() {
        return newWidgetIdMap;
    }

    public Map<String, DatasheetWidgetDTO> getNewWidgetIdToDstMap() {
        return newWidgetIdToDstMap;
    }
}
