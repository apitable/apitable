package com.vikadata.api.modular.automation.model;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AutomationActionVo {

    @ApiModelProperty(value = "action id", example = "aacxxxxxxxx")
    private String actionId;

    @ApiModelProperty(value = "robot id", example = "arbxxxxxxxx")
    private String robotId;

    @ApiModelProperty(value = "action type id", example = "aatxxxxxxxx")
    private String actionTypeId;

    @ApiModelProperty(value = "input data")
    private JSONObject input;

    @ApiModelProperty(value = "previous action id", example = "aacxxxxxxxx")
    private String nextActionId;

}
