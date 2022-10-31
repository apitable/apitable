package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class AutomationRobotDto {
    @ApiModelProperty(value = "robot ID", example = "arbtxxxxxxxxx", position = 1, required = true)
    private String robotId;

    @ApiModelProperty(value = "name", example = "0001 robot", position = 2, required = true)
    private String name;

    @ApiModelProperty(value = "description", example = "This is a test robot.", position = 3, required = true)
    private String description;
}
