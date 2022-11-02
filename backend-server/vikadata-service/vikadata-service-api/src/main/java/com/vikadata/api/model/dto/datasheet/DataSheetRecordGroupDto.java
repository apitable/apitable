package com.vikadata.api.model.dto.datasheet;

import java.util.List;

import lombok.Data;

import com.vikadata.api.model.vo.datasheet.DatasheetRecordVo;

@Data
public class DataSheetRecordGroupDto {

    private String dstId;

    private List<DatasheetRecordVo> recordVoList;
}
