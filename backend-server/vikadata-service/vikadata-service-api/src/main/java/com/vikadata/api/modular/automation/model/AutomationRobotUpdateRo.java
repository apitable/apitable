package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 更新机器人 Ro
 * </p>
 */
@Data
@ApiModel("AutomationRobot")
public class AutomationRobotUpdateRo {
    @ApiModelProperty(value = "机器人名称", example = "自动更新订单状态机器人", position = 1)
    private String name;

    @ApiModelProperty(value = "机器人描述", example = "这个机器人会自动更新订单状态", position = 2)
    private String description;

    @ApiModelProperty(value = "是否开启机器人", example = "true", position = 3)
    private Boolean isActive;
}
