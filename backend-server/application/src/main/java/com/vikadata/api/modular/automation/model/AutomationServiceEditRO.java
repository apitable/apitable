package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Automation Service Edit RO")
public class AutomationServiceEditRO {

    @ApiModelProperty(value = "name", position = 1)
    private String name;

    @ApiModelProperty(value = "description", position = 2)
    private String description;

    @ApiModelProperty(value = "input JSON format", position = 3)
    private String logo;

    @ApiModelProperty(value = "output JSON format", position = 4)
    private String baseUrl;

    @ApiModelProperty(value = "i18n package", position = 5)
    private String i18n;

}
