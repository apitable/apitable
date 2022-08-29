package com.vikadata.api.model.dto.datasheet;

import cn.hutool.json.JSONObject;
import lombok.Data;

/**
 * <p>
 * 数表记录dto
 * </p>
 *
 * @author Chambers
 * @date 2020/3/31
 */
@Data
public class DataSheetRecordDto {

    /**
     * 表ID
     */
    private Long id;

    /**
     * 数表ID
     */
    private String dstId;

    /**
     * 记录ID
     */
    private String recordId;

    /**
     * 数据
     */
    private JSONObject data;
}
