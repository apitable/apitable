package com.vikadata.api.enterprise.automation.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("ActionTypeCreateRO")
public class ActionTypeCreateRO {

    @ApiModelProperty(value = "service id", position = 1)
    @NotBlank
    private String serviceId;

    @ApiModelProperty(value = "name", position = 2)
    @NotBlank
    private String name;

    @ApiModelProperty(value = "description", position = 3)
    private String description;

    @ApiModelProperty(value = "input JSON format", position = 4)
    private String inputJsonSchema;

    @ApiModelProperty(value = "output JSON format", position = 5)
    private String outputJsonSchema;

    @ApiModelProperty(value = "trigger prototype endpoint", position = 6)
    @NotBlank
    private String endpoint;

    @ApiModelProperty(value = "i18n package", position = 7)
    private String i18n;

}
