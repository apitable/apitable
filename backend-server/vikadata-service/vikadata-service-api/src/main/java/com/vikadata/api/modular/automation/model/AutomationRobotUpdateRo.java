package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("AutomationRobot")
public class AutomationRobotUpdateRo {
    @ApiModelProperty(value = "robot name", example = "automatic order status update robot", position = 1)
    private String name;

    @ApiModelProperty(value = "robot description", example = "The robot automatically updates the status of the order.", position = 2)
    private String description;

    @ApiModelProperty(value = "whether robot is active", example = "true", position = 3)
    private Boolean isActive;
}
