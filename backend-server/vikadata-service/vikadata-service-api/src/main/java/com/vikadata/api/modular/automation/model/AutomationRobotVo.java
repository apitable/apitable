package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Map;

@Data
@ApiModel("AutomationRobot")
public class AutomationRobotVo extends AutomationRobotDto {

    @ApiModelProperty(value = "robot trigger", position = 4)
    private AutomationTriggerDto trigger;

    @ApiModelProperty(value = "entry action id", position = 5)
    private String entryActionId;

    @ApiModelProperty(value = "the robot action set", position = 6)
    private Map<String, AutomationActionVo> actionsById;
}
