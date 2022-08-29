package com.vikadata.api.model.dto.space;

import lombok.Data;

/**
 * <p>
 * 节点对应的空间附件资源dto
 * </p>
 *
 * @author Chambers
 * @date 2020/4/30
 */
@Data
public class NodeAssetDto {

    /**
     * 节点ID
     */
    private String nodeId;

    /**
     * 附件资源ID
     */
    private Long assetId;

    /**
     * 附件资源MD5
     */
    private String checksum;

    /**
     * 引用次数
     */
    private Integer cite;

    /**
     * 文件大小
     */
    private Integer fileSize;

    /**
     * 文件大小
     */
    private Integer type;

    /**
     * 源文件名
     */
    private String sourceName;
}
