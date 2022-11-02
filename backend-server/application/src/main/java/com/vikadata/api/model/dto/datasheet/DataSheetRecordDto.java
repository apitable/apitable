package com.vikadata.api.model.dto.datasheet;

import cn.hutool.json.JSONObject;
import lombok.Data;

@Data
public class DataSheetRecordDto {

    private Long id;

    private String dstId;

    private String recordId;

    private JSONObject data;
}
