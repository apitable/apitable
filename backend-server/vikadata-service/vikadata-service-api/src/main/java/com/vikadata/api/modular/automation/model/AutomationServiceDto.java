package com.vikadata.api.modular.automation.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("AutomationService")
public class AutomationServiceDto {

    @ApiModelProperty(value = "服务ID", example = "asvxxxxxxxx")
    private String serviceId;

    @ApiModelProperty(value = "服务名称", example = "asvxxxxxxxx")
    private String name;

    @ApiModelProperty(value = "服务唯一标识", example = "vika")
    private String slug;


    @ApiModelProperty(value = "Logo URL", example = "https://s")
    private String logo;
}
