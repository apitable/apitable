package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Widget Info Vo")
public class WidgetInfoVo {

    @ApiModelProperty(value = "widget name")
    private String widgetName;

    @ApiModelProperty(value = "widget description")
    private String widgetDescription;

}
