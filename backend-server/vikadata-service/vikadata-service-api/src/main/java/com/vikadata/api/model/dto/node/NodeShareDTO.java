package com.vikadata.api.model.dto.node;

import lombok.Data;

@Data
public class NodeShareDTO {

    private String nodeId;

    private String shareId;

    private String spaceId;

    private Long operator;
}
