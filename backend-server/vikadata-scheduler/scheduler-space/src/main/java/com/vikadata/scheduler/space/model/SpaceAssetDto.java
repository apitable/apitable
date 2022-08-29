package com.vikadata.scheduler.space.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 空间附件资源dto
 * </p>
 *
 * @author Chambers
 * @date 2020/4/23
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SpaceAssetDto {

    /**
     * 表ID
     */
    private Long id;

    /**
     * 节点ID
     */
    private String nodeId;

    /**
     * 引用次数
     */
    private Integer cite;

    /**
     * 云端文件存放路径
     */
    private String fileUrl;
}
