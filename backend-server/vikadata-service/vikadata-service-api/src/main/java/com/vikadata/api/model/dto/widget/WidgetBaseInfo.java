package com.vikadata.api.model.dto.widget;

import lombok.Data;

/**
 * <p>
 * 组件基本信息
 * </p>
 *
 * @author Chambers
 * @date 2021/01/11
 */
@Data
public class WidgetBaseInfo {

    private String nodeId;

    private String widgetPackageId;

    private String widgetId;

    private String name;

    private String storage;

    private Long revision;
}
