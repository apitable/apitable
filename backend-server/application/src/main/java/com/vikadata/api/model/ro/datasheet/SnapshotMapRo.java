package com.vikadata.api.model.ro.datasheet;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * DataSheet Snapshot Operation Request Parameters
 */
@ApiModel("DataSheet Snapshot Operation Request Parameters")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class SnapshotMapRo {

    @ApiModelProperty(value = "DataSheet meta set", position = 2)
    private JSONObject meta;

    @ApiModelProperty(value = "DataSheet record set", position = 3)
    private JSONObject recordMap;
}
