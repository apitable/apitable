package com.vikadata.api.workspace.dto;

import lombok.Data;

@Data
public class SimpleNodeInfo {

    private String nodeId;

    private String parentId;

    private Boolean extend;
}
