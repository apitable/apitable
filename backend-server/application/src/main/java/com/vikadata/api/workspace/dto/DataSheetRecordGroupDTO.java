package com.vikadata.api.workspace.dto;

import java.util.List;

import lombok.Data;

import com.vikadata.api.workspace.vo.DatasheetRecordVo;

@Data
public class DataSheetRecordGroupDTO {

    private String dstId;

    private List<DatasheetRecordVo> recordVoList;
}
