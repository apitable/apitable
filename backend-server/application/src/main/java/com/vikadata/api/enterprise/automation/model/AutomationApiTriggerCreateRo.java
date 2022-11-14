package com.vikadata.api.enterprise.automation.model;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@ApiModel("AutomationApiTrigger")
public class AutomationApiTriggerCreateRo {

    @ApiModelProperty(value = "robot base info", position = 1, required = true)
    @NotNull(message = "robot not null")
    private AutomationApiRobotRo robot;

    @ApiModelProperty(value = "trigger input data", position = 2, required = true)
    @NotNull(message = "trigger not null")
    private AutomationApiTriggerRo trigger;

    @ApiModelProperty(value = "the webhookURL of execute action", example = "https://xxxxx", position = 3, required = true)
    private String webhookUrl;

    @ApiModelProperty(value = "request sequence, normal 32 uuid", example = "1e16c603908743a8aaa5933faec91973", position = 4)
    @Length(max = 64)
    private String seqId;

}
