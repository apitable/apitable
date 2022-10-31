package com.vikadata.api.modular.automation.model;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("AutomationTriggerType")
public class AutomationTriggerTypeDto {
    @ApiModelProperty(value = "trigger type id", example = "attxxxxxxxx")
    private String triggerTypeId;

    @ApiModelProperty(value = "name", example = "form submit")
    private String name;

    @ApiModelProperty(value = "description", example = " This trigger is fired when there is a new submission for the specified form.")
    private String description;

    @ApiModelProperty(value = "endpoint", example = "form_submitted")
    private String endpoint;

    @ApiModelProperty(value = "input data's json scheme", example = "")
    private JSONObject inputJsonSchema;

    @ApiModelProperty(value = "output data's json scheme", example = "")
    private JSONObject outputJsonSchema;

    @ApiModelProperty(value = "service")
    private AutomationServiceDto service;
}

