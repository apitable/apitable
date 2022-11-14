package com.vikadata.api.enterprise.widget.dto;

import lombok.Data;

@Data
public class WidgetBaseInfo {

    private String nodeId;

    private String widgetPackageId;

    private String widgetId;

    private String name;

    private String storage;

    private Long revision;
}
