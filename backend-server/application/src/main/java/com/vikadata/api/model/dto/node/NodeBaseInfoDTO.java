package com.vikadata.api.model.dto.node;

import lombok.Data;

@Data
public class NodeBaseInfoDTO {

    private String nodeId;

    private String nodeName;

    private String icon;

    private String parentId;

    private Integer type;
}
