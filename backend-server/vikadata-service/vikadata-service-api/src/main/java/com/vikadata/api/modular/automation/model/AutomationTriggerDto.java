package com.vikadata.api.modular.automation.model;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 机器人触发器
 */
@Data
@ApiModel("AutomationTrigger")
public class AutomationTriggerDto {

    @ApiModelProperty(value = "机器人 ID", example = "arbxxxxxxxxx", position = 0)
    private String robotId;

    @ApiModelProperty(value = "触发器 ID", example = "rtrxxxxxxxx", position = 1)
    private String triggerId;

    @ApiModelProperty(value = "触发器原型 ID", example = "rttxxxxxxxx", position = 2)
    private String triggerTypeId;

    @ApiModelProperty(value = "触发器输入值", example = "{}", position = 3)
    private JSONObject input;
}
