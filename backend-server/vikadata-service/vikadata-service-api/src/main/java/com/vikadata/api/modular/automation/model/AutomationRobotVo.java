package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Map;

/**
 * <p>
 * 机器人 Vo
 * </p>
 *
 * @author Mayne
 * @date 2021/08/05
 */
@Data
@ApiModel("AutomationRobot")
public class AutomationRobotVo extends AutomationRobotDto {

    @ApiModelProperty(value = "机器人触发器", position = 4)
    private AutomationTriggerDto trigger;

    @ApiModelProperty(value = "入口动作ID", position = 5)
    private String entryActionId;

    @ApiModelProperty(value = "机器人的动作集合", position = 6)
    private Map<String, AutomationActionVo> actionsById;
}
