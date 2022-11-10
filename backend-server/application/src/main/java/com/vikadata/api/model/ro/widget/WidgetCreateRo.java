package com.vikadata.api.model.ro.widget;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Request parameters for widget creation
 * </p>
 */
@Data
@ApiModel("Request parameters for widget creation")
public class WidgetCreateRo {

    @ApiModelProperty(value = "Node ID", required = true, example = "dstAAA/dsbBBB", position = 1)
    @NotBlank(message = "Node ID cannot be empty")
    private String nodeId;

    @ApiModelProperty(value = "Widget Package ID", required = true, example = "wpkBBB", position = 2)
    @NotBlank(message = "The Widget package ID cannot be empty")
    private String widgetPackageId;

    @ApiModelProperty(value = "Widget name", example = "This is a widget", position = 3)
    private String name = "New Widget";
}
