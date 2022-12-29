package com.vikadata.api.workspace.ro;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.util.List;

/**
 * DataSheet Snapshot OP Operation Request Parameters
 */
@ApiModel("DataSheet Snapshot OP Operation Request Parameters")
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class OperationMapRo {

    @ApiModelProperty(value = "Operation instruction", position = 1)
    private  String cmd;

    @ApiModelProperty(value = "DataSheet record set", position = 2)
    private List<JSONObject> actions;
}
