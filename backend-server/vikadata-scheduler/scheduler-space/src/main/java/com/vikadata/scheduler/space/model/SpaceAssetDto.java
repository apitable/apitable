package com.vikadata.scheduler.space.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Space Asset Dto
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SpaceAssetDto {

    /**
     * space asset table id
     */
    private Long id;

    private String nodeId;

    private Integer cite;

    private String fileUrl;
}
