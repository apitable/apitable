package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("AutomationTrigger")
public class AutomationTriggerCreateVo {

    @ApiModelProperty(value = "机器人ID", position = 1)
    private String robotId;

    @ApiModelProperty(value = "触发器原型 ID", position = 2)
    private String triggerId;
}
