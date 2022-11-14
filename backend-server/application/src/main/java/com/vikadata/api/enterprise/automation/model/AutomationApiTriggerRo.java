package com.vikadata.api.enterprise.automation.model;

import javax.validation.constraints.NotBlank;

import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("AutomationApiTrigger")
public class AutomationApiTriggerRo {

    @NotBlank
    @ApiModelProperty(value = "Fixed format(.*@vika) for trigger name", example = "form_submitted@vika", position = 1, required = true)
    private String typeName;

    @NotBlank
    @ApiModelProperty(value = "trigger input", example = "{\"formId\": {\"type\":\"Literal\",\"value\":\"fomuzHzhN3BSpYho5d\"}}", position = 2, required = true)
    private JSONObject input;

}
