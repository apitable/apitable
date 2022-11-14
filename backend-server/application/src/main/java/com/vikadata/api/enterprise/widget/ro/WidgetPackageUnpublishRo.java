package com.vikadata.api.enterprise.widget.ro;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * Widget removal request parameters
 * </p>
 */
@Data
@ApiModel("Widget removal request parameters")
public class WidgetPackageUnpublishRo {

    @ApiModelProperty(value = "Widget Package ID", example = "wpkAAA", position = 1)
    @NotBlank(message = "Package Id cannot be empty")
    private String packageId;

}
