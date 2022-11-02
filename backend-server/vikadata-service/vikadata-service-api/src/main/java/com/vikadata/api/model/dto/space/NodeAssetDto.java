package com.vikadata.api.model.dto.space;

import lombok.Data;

@Data
public class NodeAssetDto {

    private String nodeId;

    private Long assetId;

    private String checksum;

    private Integer cite;

    private Integer fileSize;

    private Integer type;

    private String sourceName;

    private Boolean isTemplate;
}
