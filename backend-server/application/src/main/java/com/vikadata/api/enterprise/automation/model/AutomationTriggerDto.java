package com.vikadata.api.enterprise.automation.model;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("AutomationTrigger")
public class AutomationTriggerDto {

    @ApiModelProperty(value = "robot id", example = "arbxxxxxxxxx", position = 0)
    private String robotId;

    @ApiModelProperty(value = "robot id", example = "rtrxxxxxxxx", position = 1)
    private String triggerId;

    @ApiModelProperty(value = "trigger type id", example = "rttxxxxxxxx", position = 2)
    private String triggerTypeId;

    @ApiModelProperty(value = "trigger input data", example = "{}", position = 3)
    private JSONObject input;
}
