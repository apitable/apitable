package com.vikadata.scheduler.space.model;

import lombok.AllArgsConstructor;
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
public class SpaceAssetKeyDto {

    /**
     * 节点ID
     */
    private String nodeId;

    /**
     * 云端文件存放路径
     */
    private String fileUrl;
}
