package com.vikadata.scheduler.space.model;

import lombok.Data;

/**
 * <p>
 * 数表元数据dto
 * </p>
 *
 * @author Chambers
 * @date 2020/4/23
 */
@Data
public class DataSheetMetaDto {

    /**
     * 数表ID
     */
    private String dstId;

    /**
     * 元数据
     */
    private String metaData;
}
