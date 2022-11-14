package com.vikadata.api.workspace.dto;

import lombok.Data;

@Data
public class NodeShareDTO {

    private String nodeId;

    private String shareId;

    private String spaceId;

    private Long operator;
}
