package com.vikadata.api.modular.workspace.model;

import lombok.Data;

/**
 * 节点小程序信息视图
 *
 * @author liuzijing
 * @date 2022/7/29
 */
@Data
public class NodeWidgetDto {

    /**
     * 小程序名称
     */
    private String widgetName;

    /**
     * 小程序引用数表ID
     */
    private String dstId;

    /**
     * 节点ID
     */
    private String nodeId;
}
