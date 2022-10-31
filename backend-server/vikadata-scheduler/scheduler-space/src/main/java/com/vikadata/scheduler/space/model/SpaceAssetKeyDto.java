package com.vikadata.scheduler.space.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Space Asset Key Dto
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpaceAssetKeyDto {

    private String nodeId;

    private String fileUrl;
}
