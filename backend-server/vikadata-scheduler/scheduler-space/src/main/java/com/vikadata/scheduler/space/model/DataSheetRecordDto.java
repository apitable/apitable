package com.vikadata.scheduler.space.model;

import lombok.Data;

import java.util.List;

/**
 * <p>
 * Datasheet Record Dto
 * </p>
 */
@Data
public class DataSheetRecordDto {

    private String dstId;

    private List<String> dataList;
}
