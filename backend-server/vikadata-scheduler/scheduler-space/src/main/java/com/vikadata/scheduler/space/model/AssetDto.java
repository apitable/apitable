package com.vikadata.scheduler.space.model;

import lombok.Data;

/**
 * <p>
 * 附件资源dto
 * </p>
 *
 * @author Chambers
 * @date 2020/4/23
 */
@Data
public class AssetDto {

    /**
     * 表ID
     */
    private Long id;

    /**
     * 整个文件的Hash，MD5摘要
     */
    private String checksum;

    /**
     * 文件大小(单位:byte)
     */
    private Integer fileSize;

    /**
     * 云端文件存放路径
     */
    private String fileUrl;
}
