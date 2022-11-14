package com.vikadata.api.workspace.dto;

import lombok.Data;

@Data
public class NodeBaseInfoDTO {

    private String nodeId;

    private String nodeName;

    private String icon;

    private String parentId;

    private Integer type;
}
