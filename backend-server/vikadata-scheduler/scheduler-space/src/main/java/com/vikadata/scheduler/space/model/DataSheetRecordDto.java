package com.vikadata.scheduler.space.model;

import lombok.Data;

import java.util.List;

/**
 * <p>
 * 数表记录dto
 * </p>
 *
 * @author Chambers
 * @date 2020/4/23
 */
@Data
public class DataSheetRecordDto {

    /**
     * 数表ID
     */
    private String dstId;

    /**
     * 数据
     */
    private List<String> dataList;
}
