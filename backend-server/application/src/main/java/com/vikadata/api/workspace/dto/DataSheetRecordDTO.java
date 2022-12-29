package com.vikadata.api.workspace.dto;

import cn.hutool.json.JSONObject;
import lombok.Data;

@Data
public class DataSheetRecordDTO {

    private Long id;

    private String dstId;

    private String recordId;

    private JSONObject data;
}
