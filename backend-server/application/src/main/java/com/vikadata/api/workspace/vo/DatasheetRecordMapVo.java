package com.vikadata.api.workspace.vo;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;


/**
 * <p>
 * Record Map returns the result value of multiple records in the data table
 * </p>
 */
@ApiModel("Record Map returns the result value of multiple records in the data table")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DatasheetRecordMapVo {

    @ApiModelProperty(value = "Datasheet ID", hidden = true)
    String dstId;

    @ApiModelProperty(value = "Record Map Collection", position = 1)
    JSONObject recordMap;

}
