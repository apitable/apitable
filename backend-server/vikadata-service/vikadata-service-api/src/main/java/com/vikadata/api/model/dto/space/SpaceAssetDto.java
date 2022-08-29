package com.vikadata.api.model.dto.space;

import lombok.Data;

/**
 * <p>
 * 空间附件资源dto
 * </p>
 *
 * @author Chambers
 * @date 2020/3/21
 */
@Data
public class SpaceAssetDto {

    /**
     * ID
     */
    private Long id;

    /**
     * 引用次数
     */
    private Integer cite;
    /**
     * 类型
     */
    private Integer type;

    /**
     * md5摘要
     */
    private String assetChecksum;
}
