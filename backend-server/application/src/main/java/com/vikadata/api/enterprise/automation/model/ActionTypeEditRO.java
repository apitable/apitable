package com.vikadata.api.enterprise.automation.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("ActionTypeEditRO")
public class ActionTypeEditRO {

    @ApiModelProperty(value = "name", position = 1)
    private String name;

    @ApiModelProperty(value = "description", position = 2)
    private String description;

    @ApiModelProperty(value = "input JSON format", position = 3)
    private String inputJsonSchema;

    @ApiModelProperty(value = "output JSON format", position = 4)
    private String outputJsonSchema;

    @ApiModelProperty(value = "trigger prototype endpoint", position = 5)
    private String endpoint;

    @ApiModelProperty(value = "i18n package", position = 6)
    private String i18n;

}
