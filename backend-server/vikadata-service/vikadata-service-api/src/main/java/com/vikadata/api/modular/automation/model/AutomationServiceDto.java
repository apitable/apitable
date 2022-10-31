package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("AutomationService")
public class AutomationServiceDto {

    @ApiModelProperty(value = "service id", example = "asvxxxxxxxx")
    private String serviceId;

    @ApiModelProperty(value = "service name", example = "asvxxxxxxxx")
    private String name;

    @ApiModelProperty(value = "service unique identifier", example = "vika")
    private String slug;


    @ApiModelProperty(value = "Logo URL", example = "https://s")
    private String logo;
}
