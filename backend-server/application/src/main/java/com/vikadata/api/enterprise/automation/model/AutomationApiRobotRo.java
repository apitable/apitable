package com.vikadata.api.enterprise.automation.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("AutomationApiTrigger")
public class AutomationApiRobotRo {

    @NotBlank
    @ApiModelProperty(value = "name", example = "order nformation notification robot", position = 1, required = true)
    private String name;

    @ApiModelProperty(value = "description", example = "This is a test robot.", position = 2, required = true)
    private String description;

    @NotBlank
    @ApiModelProperty(value = "resource id", example = "dstL8cTQmPqaRPcbRF", position = 3, required = true)
    private String resourceId;

}
