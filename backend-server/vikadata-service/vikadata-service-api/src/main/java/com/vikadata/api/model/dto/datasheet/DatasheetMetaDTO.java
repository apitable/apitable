package com.vikadata.api.model.dto.datasheet;

import lombok.Data;

/**
 * <p>
 * 数表元数据 DTO
 * </p>
 *
 * @author Chambers
 * @date 2021/7/7
 */
@Data
public class DatasheetMetaDTO {

    /**
     * 数表自定义ID
     */
    private String dstId;

    /**
     * 元数据
     */
    private String metaData;
}
