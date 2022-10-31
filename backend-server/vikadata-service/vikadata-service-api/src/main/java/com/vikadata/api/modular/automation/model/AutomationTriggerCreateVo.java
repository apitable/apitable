package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("AutomationTrigger")
public class AutomationTriggerCreateVo {

    @ApiModelProperty(value = "robot id", position = 1)
    private String robotId;

    @ApiModelProperty(value = "trigger id", position = 2)
    private String triggerId;
}
