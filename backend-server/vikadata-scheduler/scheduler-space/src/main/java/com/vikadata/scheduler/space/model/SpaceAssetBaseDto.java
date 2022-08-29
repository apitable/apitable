package com.vikadata.scheduler.space.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 空间附件资源基本
 * </p>
 *
 * @author zoe zheng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SpaceAssetBaseDto {

    /**
     * 表ID
     */
    private Long id;

    /**
     * MD5摘要
     */
    private String checksum;

    /**
     * 源文件名
     */
    private String fileUrl;

    /**
     * 存储桶标志
     */
    private String bucket;
}
