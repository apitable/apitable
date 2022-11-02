package com.vikadata.api.model.dto.space;

import lombok.Data;

@Data
public class SpaceAssetDto {

    private Long id;

    private Integer cite;

    private Integer type;

    private String assetChecksum;
}
