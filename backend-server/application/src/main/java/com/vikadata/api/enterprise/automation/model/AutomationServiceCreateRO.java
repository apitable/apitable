package com.vikadata.api.enterprise.automation.model;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Automation Service Create RO")
public class AutomationServiceCreateRO {

    @ApiModelProperty(value = "service id", position = 1)
    @NotBlank
    private String slug;

    @ApiModelProperty(value = "name", position = 2)
    @NotBlank
    private String name;

    @ApiModelProperty(value = "description", position = 3)
    private String description;

    @ApiModelProperty(value = "input JSON format", position = 4)
    private String logo;

    @ApiModelProperty(value = "output JSON format", position = 5)
    private String baseUrl;

    @ApiModelProperty(value = "i18n package", position = 6)
    private String i18n;

}
