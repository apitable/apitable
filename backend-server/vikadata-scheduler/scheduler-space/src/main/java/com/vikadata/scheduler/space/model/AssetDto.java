package com.vikadata.scheduler.space.model;

import lombok.Data;

/**
 * <p>
 * Asset Dto
 * </p>
 */
@Data
public class AssetDto {

    private Long id;

    /**
     * file MD5
     */
    private String checksum;

    /**
     * file size(unit:byte)
     */
    private Integer fileSize;

    /**
     * relative path
     */
    private String fileUrl;
}
